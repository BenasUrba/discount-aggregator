const express = require('express');
const app = express();
const productsRouter = require('./routes/products');

app.use(express.json());
app.use('/api/products', productsRouter);

const PORT = process.env.DB_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});