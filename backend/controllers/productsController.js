const { pool } = require('../db');

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
        params.push(`%${search}%`);
        conditions.push(`title ILIKE $${params.length}`);
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