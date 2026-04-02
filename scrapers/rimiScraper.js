const { chromium } = require("playwright");
const { insertProducts } = require('../backend/db/products');
const { pool } = require('../backend/db/index');

async function paginationLoader(page) {
    let allProducts = [];

    const totalPages = await page.$$eval(
        "ul.pagination__list li a",
        links => {
            const numbers = links
                .map(link => link?.textContent.trim())
                .filter(text => /^\d+$/.test(text))
                .map(Number);

            return numbers.length ? Math.max(...numbers) : 1;
        }
    );

    for (let i = 1; i <= totalPages; i++) {
        await page.goto(`https://www.rimi.lt/e-parduotuve/lt/akcijos?currentPage=${i}&pageSize=80`,
            {waitUntil: "domcontentloaded", timeout: 60000}
        );
        await page.waitForSelector('.product-grid__item', { timeout: 40000});

        const products = await getProducts(page);
        allProducts.push(...products);

        await page.waitForTimeout(1000 + Math.random() * 500);
    }

    return allProducts;
}

async function getProducts(page) {
    return await page.$$eval('.product-grid__item', nodes =>
        nodes.map(node => {
            const baseWhole = node.querySelector('.price-tag.card__price span')?.innerText.trim() || '';
            const baseCents = node.querySelector('.price-tag.card__price sup')?.innerText.trim() || '';
            const basePrice = baseWhole && baseCents ? Number(`${baseWhole}.${baseCents}`) : (baseWhole ? Number(baseWhole) : null);

            const oldPriceRaw = node.querySelector('.old-price-tag.card__old-price')?.innerText.trim() || '';
            const oldPriceParsed = oldPriceRaw ? Number(oldPriceRaw.replace(/[^\d,.-]/g, '').replace(',','.')) : null;

            const discountWhole = node.querySelector('.price-label__price .major')?.innerText.trim() || '';
            const discountCents = node.querySelector('.price-label__price .minor .cents')?.innerText.trim() || '';
            const discountPrice = discountWhole && discountCents ? Number(`${discountWhole}.${discountCents}`) : (discountWhole ? Number(discountWhole) : null);

            let price, oldPrice;
            if (discountPrice !== null) {
                price = discountPrice;
                oldPrice = basePrice;
            } else {
                price = basePrice;
                oldPrice = oldPriceParsed;
            }

            const discountInfo = node.querySelector('.price-label__header span')?.innerText.trim() || '';
           
            let discount_percentage = null;

            if (discountInfo) {
                const match = discountInfo.match(/-?\d+%/);

                if (match) {
                    discount_percentage = Math.abs(parseInt(match[0]));
                } 
            }
            if (!discount_percentage && price && oldPrice && oldPrice > price) {
                    discount_percentage = Math.round(((oldPrice - price) / oldPrice) * 100);
            }

            return {
                store: "Rimi",
                title: node.querySelector('.card__name')?.innerText.trim() || '',
                validFrom: null,
                validUntil: null,
                image: node.querySelector('.card__image-wrapper img[data-src]')?.dataset.src || '',
                price,
                oldPrice,
                loyaltyRequired: !!node.querySelector('.price-label img')?.src,
                storeSize: null,
                description: node.querySelector('.card__price-per')?.innerText.trim() || '',
                discountInfo,
                productBrand: null,
                discountDescription: node.querySelector('.price-per-unit')?.innerText.trim() || '',
                discount_percentage
            }})
    );
}

async function saveProducts(products, store) {
    await pool.query('DELETE FROM products WHERE store = $1', [store])

    for (const product of products) {
        await insertProducts(product);
    }
}

async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto("https://www.rimi.lt/e-parduotuve/lt/akcijos?pageSize=80",
            {waitUntil: "networkidle", timeout: 60000}
        );

        const products = await paginationLoader(page);

        await saveProducts(products, 'Rimi');

        console.log(`Product Count: ${products.length}`);
        return products;
    } catch (error) {
        console.error(`An error occured: ${error}`);
        throw error;
    } finally {
        await browser.close()
    }
}

main();