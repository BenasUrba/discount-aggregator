const { pool } = require('../db');
const { normalizeSearch, expandSearch } = require('../utils/searchUtils');

const getAllProducts = async  (req, res) => {
    const { store, search, page, limit } = req.query;

    let baseQuery = 'FROM products';
    let params = [];
    let conditions = [];

    if (store) {
        params.push(store);
        conditions.push(`store = $${params.length}`);
    }

    if (search) {
        const normalizeText = normalizeSearch(search);
        const terms = expandSearch(normalizeText);

        const searchConditions = terms.map((_, index) => 
            `title_clean ILIKE $${params.length + index + 1}`
        );

        conditions.push(`(${searchConditions.join(" OR ")})`);
        terms.forEach(term => params.push(`%${term}%`));
    }

    if (conditions.length > 0) {
        baseQuery += ` WHERE ` + conditions.join(' AND ');
    }

    const currentPage = Math.max(1, parseInt(page) || 1);
    const currentLimit = Math.min(80, parseInt(limit) || 80);

    const offset = (currentPage - 1) * currentLimit;

    const dataParams = [...params, currentLimit, offset];

    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const dataQuery = `SELECT * ${baseQuery} LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`;

    try {
        const dataResults = await pool.query(dataQuery, dataParams);
        const countResults = await pool.query(countQuery, params);
        const totalProducts = parseInt(countResults.rows[0].count);
        res.json({
            products: dataResults.rows,
            totalProducts: totalProducts,
            page: currentPage,
            totalPages: Math.ceil(totalProducts / currentLimit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTopDiscounts = async (req, res) => {
    const { store, limit } = req.query;
    const productLimit = Math.min(parseInt(limit) || 100, 200);

    let query = "SELECT * FROM products WHERE discount_percentage IS NOT NULL";
    const params = [];

    if (store) {
        params.push(store);
        query += ` AND store = $${params.length}`;
    }

    if (productLimit) {
        params.push(productLimit);
        query += ` ORDER BY discount_percentage DESC LIMIT $${params.length}`;
    }

    try {
        const result = await pool.query(query, params);
        res.json({
            products:result.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllProducts, getTopDiscounts };