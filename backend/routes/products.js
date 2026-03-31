const express = require('express');
const router = express.Router();
const { getAllProducts, getTopDiscounts } = require('../controllers/productsController');

router.get('/', getAllProducts);

router.get('/top', getTopDiscounts);

module.exports = router;