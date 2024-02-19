
const express = require('express');
const mongoose = require('mongoose');
const mongoFuncs = require('./mongowala.js');
const dummyData = require('./data/products.json');

const app = express();

mongoose.connect('mongodb+srv://Ayush:2BXNWx4qaZkr3C5y@cluster0.ijs1ymf.mongodb.net/products').then(() => console.log('MongoDB Connected'))
.catch(err => console.log("Mongo error", err));



app.use(express.json());

// // Routes using productController mongoFuncs functions
app.post('/products', mongoFuncs.createProduct);
app.get('/products', mongoFuncs.getAllProducts);
app.get('/products/:id', mongoFuncs.getProductById);
app.put('/products/:id', mongoFuncs.updateProductById);
app.delete('/products/:id', mongoFuncs.deleteProductById);

// // Routes using orderController mongoFuncs functions
app.post('/orders', mongoFuncs.createOrder);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
