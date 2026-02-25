const express = require('express');
const productsRouter = require('./routes/products');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});