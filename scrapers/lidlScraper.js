const { chromium } = require('playwright');
const fs = require('fs');

async function getDiscountPageLink(page) {
    await page.goto(
        'https://www.lidl.lt/',
        { waitUntil: 'domcontentloaded', timeout: 60000  }
    );

    const discountLink = await page
      .locator('a.ABaseContentTile__content', {
        hasText: 'savaitės akcijos'
        })
      .getAttribute('href');

      if (!discountLink) throw new Error("Discount link was not found");

      return 'https://www.lidl.lt/' + discountLink;
}

async function lazyLoadingScroller(page) {
    await page.waitForSelector('.product-grid-box');

    let lastCount = 0;
    let scrollAttempts = 0;
    let stableRounds = 0;
    const maxScrolls = 50;

    while (scrollAttempts < maxScrolls) {
        await page.mouse.wheel(0, 1000);
        await page.waitForTimeout(1500 + Math.random() * 800);

        const count = await page.$$eval('.product-grid-box', els => els.length);

        if (count === lastCount && count > 0) {
            stableRounds++;
            if (stableRounds >= 4) break; 
        } else {
                stableRounds = 0;
        }
    
        lastCount = count;
        scrollAttempts++;
    }
}

async function getProductInfo(page) {
    return await page.$$eval('.product-grid-box', nodes =>
        nodes.map(node => ({
            title: node.querySelector('.product-grid-box__title')?.innerText.trim() || '',
            brand: node.querySelector('.product-grid-box__brand')?.innerText.trim() || '',
            oldPrice: node.querySelector('.ods-price__stroke-price s')?.innerText.trim() || '',
            currentPrice: node.querySelector('.ods-price__value')?.innerText.trim() || '',
            priceWrapper: node.querySelector('.ods-price__box-content-text-el')?.innerText.trim() || '',
            lidlPlusDeal: !!node.querySelector('.ods-price__lidl-plus-icon'),
            productSize: node.querySelector('.ods-price__footer')?.innerText.trim() || '',
            limitedTime: node.querySelector('.ods-badge__label')?.innerText.trim() || '',
            image: node.querySelector('.odsc-image-gallery__image')?.src || ''
        }))
    );
}

function exportToCSV(products, filename='lidlProducts.csv') {
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
        const discountPageUrl = await getDiscountPageLink(page);
        await page.goto(discountPageUrl, { waitUntil: 'domcontentloaded' });

        await lazyLoadingScroller(page);
        const products = await getProductInfo(page);

        exportToCSV(products);

        console.log("Products count:", products.length);
        return products;
    } catch (error) {
        console.error("Fetch failed:", error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

main();