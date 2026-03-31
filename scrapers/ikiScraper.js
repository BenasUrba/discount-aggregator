const { chromium } = require('playwright');
const { insertProducts } = require('../backend/db/products');
const { pool } = require('../backend/db/index');

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
        nodes.map(node => {
            const rawDates = node.querySelector('.mt-3 > p')?.innerText.trim() || '';
            let validFrom = null;
            let validUntil = null;

            if (rawDates) {
                const rangeMatch = rawDates.match(/(\d{2})\.(\d{2})\s*-\s*(\d{2})\.(\d{2})/);
                if (rangeMatch) {
                    const [ , startMonth, startDay, endMonth, endDay] = rangeMatch;
                    const year = new Date().getFullYear();

                    validFrom = `${year}-${startMonth}-${startDay}`;
                    validUntil = `${year}-${endMonth}-${endDay}`;
                } else {
                    const exactDateMatch = rawDates.match(/(\d{4})\s*m\.\s*(\w+)\s*(\d{1,2})\s*d\./i);

                    if (exactDateMatch) {
                        const [ , year, monthLt, day] = exactDateMatch;

                        const months = {
                            sausio: '01',
                            vasario: '02',
                            kovo: '03',
                            balandžio: '04',
                            gegužės: '05',
                            birželio: '06',
                            liepos: '07',
                            rugpjūčio: '08',
                            rugsėjo: '09',
                            spalio: '10',
                            lapkričio: '11',
                            gruodžio: '12'
                        };

                        const month = months[monthLt.toLowerCase()];

                        if (month) {
                            validFrom = `${year}-${month}-${day.padStart(2, '0')}`;
                            validUntil = `${year}-${month}-${day.padStart(2, '0')}`;
                        }
                    }
                }
            }

            const price = (() => {
                const whole = node.querySelector('.price_block_wrapper > .price_int')?.innerText.trim() || '';
                const cents = node.querySelector('.price_block_wrapper > .price_cents > span')?.innerText.trim() || '';
                return whole && cents ? Number(`${whole}.${cents}`) : (whole ? Number(whole): null);
            })();

            const oldPrice = (() => {
                const whole = node.querySelector('.price_old_block > .price_int')?.innerText.trim() || '';
                const cents = node.querySelector('.price_old_block > .price_cents')?.innerText.trim() || '';
                return whole && cents ? Number(`${whole}.${cents}`) : (whole ? Number(whole): null);
            })();

            const discountInfo = Array.from(node.querySelectorAll('.price_block_red_wrapper span, .price_block_rounded_red_wrapper span'))
                                    .map(s => s.innerText.trim())
                                    .filter(Boolean)
                                    .join('');
                                    
            let discount_percentage = null

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
                store: "IKI",
                title: node.querySelector('.akcija_title')?.innerText.trim() || '',
                validFrom,
                validUntil,
                image: node.querySelector('.card-img-top')?.src || '',
                price,
                oldPrice,
                loyaltyRequired: !!node.querySelector('.card img')?.src,
                storeSize: node.querySelectorAll('.store-list-item__hearts img').length,
                description: node.querySelector('.akcija_description')?.innerText.trim() || '',
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
        const discountLink = await getDiscountPageLink(page);
        await page.goto(discountLink, { waitUntil: 'domcontentloaded' });

        await lazyLoadingScroller(page);
        const products = await getProducts(page);

        await saveProducts(products, 'IKI');

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