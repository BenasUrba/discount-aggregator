const { chromium } = require('playwright');
const { insertProducts } = require('../backend/db/products');
const { pool } = require('../backend/db/index');

async function getProducts(page) {
    return await page.$$eval('[data-controller="offerCard"]', nodes => 
        nodes.map(node => {
            const rawDates = node.querySelector('.offer-price-tag__meta-date')?.innerText.trim() || '';
            let validFrom = null;
            let validUntil = null;

            if (rawDates) {
                const dateMatch = rawDates.match(/(?:Iki)?\s*(\d{2})\.(\d{2})/i);

                if (dateMatch) {
                    const [ , month, day] = dateMatch;
                    const year = new Date().getFullYear();

                    validFrom = null;
                    validUntil = `${year}-${month}-${day}`;
                } else {
                    validFrom = null;
                    validUntil = null;
                }
            }

            const price = (() => {
                    const whole = node.querySelector('.offer-price-tag__price-integer')?.innerText.trim() || '';
                    const cents = node.querySelector('.offer-price-tag__price-fraction')?.innerText.trim() || '';
                    return whole && cents ? Number(`${whole}.${cents}`) : (whole ? Number(whole): null);
                })();
            
            const oldPrice = Number(node.querySelector('.offer-price-tag__old-price')?.innerText.trim().replace(/[^\d,.-]/g, '').replace(',','.')) || null;
                
            const discountInfo = (() => {
                    const discount = node.querySelector('.offer-price-tag__discount-value')?.innerText.trim() || '';
                    const discount_percentage = node.querySelector('.offer-price-tag__bottom-discount')?.innerText.trim() || '';
                    const discount_wrapper = node.querySelector('.offer-price-tag__benefit')?.innerText.trim() || '';
                    return discount ? `${discount}%` : discount_percentage ? discount_percentage : discount_wrapper;
                })();

            let discount_percentage = null;

            if (discountInfo) {
                const match = discountInfo.match(/-?\d+%/);

                if (match) {
                    discount_percentage = Math.abs(parseInt(match[0]));
                }
            }
            if (!discount_percentage && price && oldPrice && oldPrice > price) {
                discount_percentage = Math.round(((oldPrice - price) / oldPrice ) * 100);
            }

            return {
                store: "Maxima",
                title: node.querySelector('.mt-4')?.innerText.trim() || '',
                validFrom,
                validUntil,
                image: node.querySelector('.offer-image img')?.src || '',
                price,
                oldPrice,
                loyaltyRequired: !!node.querySelector('.offer-price-tag__icon img')?.src,
                storeSize: node.querySelectorAll('.offer-price-tag__meta-icon img').length,
                description: node.querySelector('.offer-price-tag__meta-comparison')?.innerText.trim() || '',
                discountInfo,
                productBrand: null,
                discountDescription: null,
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
        await page.goto(
            'https://www.maxima.lt/pasiulymai',
            { waitUntil: 'domcontentloaded', timeout: 60000  }
        );

        await page.waitForSelector('[data-controller="offerCard"]');

        const products = await getProducts(page);

        await saveProducts(products, 'Maxima');

        console.log(`Product count: ${products.length}`);
        return products;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await browser.close();
    }
}

main();