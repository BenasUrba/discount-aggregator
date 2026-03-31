const { pool } = require('./index');
const { normalizeSearch } = require('../utils/searchUtils');

async function insertProducts(product) {
    const query = `
        INSERT INTO products
        (store, title, valid_from, valid_until, image, price, old_price, loyalty_required, store_size, description, discount_info, product_brand, discount_description, title_clean, discount_percentage)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
        `;

    const values = [
        product.store,
        product.title,
        product.validFrom,
        product.validUntil,
        product.image,
        product.price,
        product.oldPrice,
        product.loyaltyRequired,
        product.storeSize,
        product.description,
        product.discountInfo,
        product.productBrand,
        product.discountDescription,
        normalizeSearch(product.title || ""),
        product.discount_percentage
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
}

module.exports = { insertProducts };