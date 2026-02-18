const pool = require('./index');

async function insertProducts(product) {
    const query = `
        INSERT INTO products
        (store, title, validUntil, image, price, oldPrice, loyaltyRequired, storeSize, description, discountInfo, productBrand, discountDescription)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT DO NOTHING
        RETURNING *;
        `;

    const values = [
        product.store,
        product.title,
        product.validUntil,
        product.image,
        product.price,
        product.oldPrice,
        product.loyaltyRequired,
        product.storeSize,
        product.description,
        product.discountInfo,
        product.productBrand,
        product.discountDescription
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
}

module.exports = { insertProducts };