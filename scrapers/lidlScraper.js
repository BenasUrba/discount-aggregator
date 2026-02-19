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
        nodes.map(node => {
            const parsePrice = (price) => {
                if (!price) return null;
                return Number(price.replace(/[^\d,.-]/g, '').replace(',','.'));
            };

            const rawPrice = node.querySelector('.ods-price__value')?.innerText.trim() || '';
            const rawOldPrice = node.querySelector('.ods-price__stroke-price s')?.innerText.trim() || '';

            const rawDates = node.querySelector('.ods-badge__label')?.innerText.trim() || null;
            let validFrom = null;
            let validUntil = null;

            if (rawDates) {
                const rangeMatch = rawDates.match(/(\d{2}) (\d{2})\s*-\s*(\d{2}) (\d{2})/);
                if (rangeMatch) {
                    const [ , startMonth, startDay, endMonth, endDay] = rangeMatch;
                    const year = new Date().getFullYear();
                    validFrom = `${year}-${startMonth}-${startDay}`;
                    validUntil = `${year}-${endMonth}-${endDay}`;
                } else {
                    const startMatch = rawDates.match(/(?:Nuo)?\s*(\d{2}) (\d{2})/i);
                    if (startMatch) {
                        const [ , month, day] = startMatch;
                        const year = new Date().getFullYear();
                        validFrom = `${year}-${month}-${day}`;
                        validUntil = null;
                    }
                }
            }

            return {
                store: "Lidl",
                title: node.querySelector('.product-grid-box__title')?.innerText.trim() || '',
                validFrom,
                validUntil,
                image: node.querySelector('.odsc-image-gallery__image')?.src || '',
                price: parsePrice(rawPrice),
                oldPrice: parsePrice(rawOldPrice),
                loyaltyRequired: !!node.querySelector('.ods-price__lidl-plus-icon'),
                storeSize: null,
                description: node.querySelector('.ods-price__footer')?.innerText.trim() || '',
                discountInfo: node.querySelector('.ods-price__box-content-text-el')?.innerText.trim() || '',
                productBrand: node.querySelector('.product-grid-box__brand')?.innerText.trim() || '',
                discountDescription: null
        }})
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