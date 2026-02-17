const { chromium } = require("playwright");
const fs = require('fs');

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
        await page.waitForSelector('.product-grid__item', { timeout: 20000});

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
            const basePrice = baseWhole && baseCents ? `${baseWhole}.${baseCents}` : baseWhole;

            const oldPriceRaw = node.querySelector('.old-price-tag.card__old-price')?.innerText.trim() || '';

            const discountWhole = node.querySelector('.price-label__price .major')?.innerText.trim() || '';
            const discountCents = node.querySelector('.price-label__price .minor .cents')?.innerText.trim() || '';
            const discountPrice = discountWhole && discountCents ? `${discountWhole}.${discountCents}` : discountWhole;

            let price, oldPrice;
            if (discountPrice) {
                price = discountPrice;
                oldPrice = basePrice;
            } else {
                price = basePrice;
                oldPrice = oldPriceRaw;
            }

            return {
                store: "Rimi",
                title: node.querySelector('.card__name')?.innerText.trim() || '',
                validUntil: null,
                image: node.querySelector('.card__image-wrapper img')?.src || '',
                price,
                oldPrice,
                loyaltyRequired: !!node.querySelector('.price-label img')?.src,
                storeSize: null,
                description: node.querySelector('.card__price-per')?.innerText.trim() || '',
                discountInfo: node.querySelector('.price-label__header span')?.innerText.trim() || '',
                productBrand: null,
                discountDescription: node.querySelector('.price-per-unit')?.innerText.trim() || ''
        }})
    );
}

function exportToCSV(products, filename='rimiProducts.csv') {
    if (!products.length) {
        console.log('No products to export');
        return;
    }

    const headers = Object.keys(products[0]);

    const rows = products.map(p => 
        headers.map(h => `"${(p[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')
    );

    const csv = [
        headers.join(','),
        ...rows
    ].join('\n');

    fs.writeFileSync(filename, csv, 'utf8');
    console.log(`CSV saved as ${filename}`);
}

async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto("https://www.rimi.lt/e-parduotuve/lt/akcijos?pageSize=80",
            {waitUntil: "domcontentloaded", timeout: 60000}
        );

        const products = await paginationLoader(page);
        await exportToCSV(products);

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