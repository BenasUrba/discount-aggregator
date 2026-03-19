const { pool } = require('../db');
const { normalizeSearch, expandSearch } = require('../utils/searchUtils');

const getAllProducts = async  (req, res) => {
    const { store, search } = req.query;

    let query = 'SELECT * FROM products';
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
        query += ` WHERE ` + conditions.join(' AND ');
    }

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllProducts };