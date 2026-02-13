const { chromium } = require('playwright');
const fs = require('fs');

async function getProducts(page) {
    return await page.$$eval('[data-controller="offerCard"]', nodes => 
        nodes.map(node => ({
            title: node.querySelector('.mt-4')?.innerText.trim() || '',
            image: node.querySelector('.offer-image img')?.src || '',
            description: node.querySelector('.row .col-12')?.innerText.trim() || '',
            limitedTime: node.querySelector('.text-small span')?.innerText.trim() || '',
            discountPercentage: (() => {
                const discount = node.querySelector('.discount')?.innerText.trim() || '';
                const percentage = node.querySelector('.percentage-symbol')?.innerText.trim() || '';
                return discount && percentage ? `${discount}${percentage}` : discount;
            })(),
            oldPrice: (() => {
                const whole = node.querySelector('div.bg-white .price-eur')?.innerText.trim() || '';
                const cents = node.querySelector('div.bg-white .price-cents')?.innerText.trim() || '';
                const crossedPrice = node.querySelector('.price-old')?.innerText.trim() || '';
                return whole && cents ? `${whole}.${cents}` : crossedPrice;
            })(),
            price: (() => {
                const whole = node.querySelector('div.bg-primary .price-eur')?.innerText.trim() || '';
                const cents = node.querySelector('div.bg-primary .price-cents')?.innerText.trim() || '';
                return whole && cents ? `${whole}.${cents}` : whole;
            })(),
            aciuDeal: !!node.querySelector('.icon-wrapper img')?.src,
            storeSize: node.querySelectorAll('.d-inline-block img.x-icon').length,
        }))
    );
}

function exportToCSV(products, filename='maximaProducts.csv') {
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
        await page.goto(
            'https://www.maxima.lt/pasiulymai',
            { waitUntil: 'domcontentloaded', timeout: 60000  }
        );

        await page.waitForSelector('[data-controller="offerCard"]');

        const products = await getProducts(page);

        exportToCSV(products);

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