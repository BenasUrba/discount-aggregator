const { chromium } = require('playwright');
const fs = require('fs');

async function getDiscountPageLink(page) {
    await page.goto(
        'https://iki.lt/',
        { waitUntil: 'domcontentloaded', timeout: 60000  }
    );

    const discountLink = await page
      .locator('a.button', {hasText: 'VISOS AKCIJOS'})
      .getAttribute('href');

      if (!discountLink) throw new Error("Discount link was not found");

      return discountLink;
}

async function lazyLoadingScroller(page) {
    await page.waitForSelector('.tag_class-savaites-akcijos');

    let lastCount = 0;
    let scrollAttempts = 0;
    let stableRounds = 0;
    const maxScrolls = 50;

    while (scrollAttempts < maxScrolls) {

        await page.mouse.wheel(0, 1500);
        await page.waitForTimeout(2000 + Math.random() * 1500);

        const count = await page.$$eval('.tag_class-savaites-akcijos', els => els.length);

        if (count === lastCount && count > 0) {
            stableRounds++;
            if (stableRounds >= 4) break;
        } else {
            stableRounds = 0
        }

        lastCount = count;
        scrollAttempts++;
    }
}

async function getProducts(page) {
    return await page.$$eval('.tag_class-savaites-akcijos', nodes =>
        nodes.map(node => ({
            title: node.querySelector('.akcija_title')?.innerText.trim() || '',
            description: node.querySelector('.akcija_description')?.innerText.trim() || '',
            image: node.querySelector('.card-img-top')?.src || '',
            productWrapper: Array.from(node.querySelectorAll('.price_block_red_wrapper span'))
                                  .map(s => s.innerText.trim())
                                  .filter(Boolean)
                                  .join(''),
            price: (() => {
                const whole = node.querySelector('.price_block_wrapper > .price_int')?.innerText.trim() || '';
                const cents = node.querySelector('.price_block_wrapper > .price_cents > span')?.innerText.trim() || '';
                return whole && cents ? `${whole}.${cents}` : whole;
            })(),
            oldPrice: (() => {
                const whole = node.querySelector('.price_old_block > .price_int')?.innerText.trim() || '';
                const cents = node.querySelector('.price_old_block > .price_cents')?.innerText.trim() || '';
                return whole && cents ? `${whole}.${cents}` : whole;
            })(),
            limitedTime: node.querySelector('.mt-3 > p')?.innerText.trim() || '',
            storeSize: node.querySelectorAll('.store-list-item__hearts img').length,
        }))
    );
}

function exportToCSV(products, filename='ikiProducts.csv') {
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
        const discountLink = await getDiscountPageLink(page);
        await page.goto(discountLink, { waitUntil: 'domcontentloaded' });

        await lazyLoadingScroller(page);
        const products = await getProducts(page);

        exportToCSV(products);

        console.log(`Product count: ${products.length}`);
        return products;
    } catch (error) {
        console.error("Fetch failed:", error.message);
        throw error;
    } finally {
        await browser.close();
    }

}

main();