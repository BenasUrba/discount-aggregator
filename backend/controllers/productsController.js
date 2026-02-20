const { pool } = require('../db');

const getAllProducts = async  (req, res) => {
    const { store } = req.query;

    let query = 'SELECT * FROM products';
    let params = [];

    if (store) {
        query += ' WHERE store = $1';
        params.push(store);
    }

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllProducts };