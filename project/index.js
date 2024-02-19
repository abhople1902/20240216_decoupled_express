
const express = require('express');
const mongoose = require('mongoose');
const mongoFuncs = require('./mongowala.js');
const dummyData = require('./data/products.json');

const app = express();

mongoose.connect('mongodb+srv://Ayush:2BXNWx4qaZkr3C5y@cluster0.ijs1ymf.mongodb.net/products').then(() => console.log('MongoDB Connected'))
  .catch(err => console.log("Mongo error", err));



app.use(express.json());



let bigFlag = true



if (bigFlag) {
  // // Routes using productController mongoFuncs functions
  app.post('/products', mongoFuncs.createProduct);
  app.get('/products', mongoFuncs.getAllProducts);
  app.get('/products/:id', mongoFuncs.getProductById);
  app.put('/products/:id', mongoFuncs.updateProductById);
  app.delete('/products/:id', mongoFuncs.deleteProductById);

  // // Routes using orderController mongoFuncs functions
  app.post('/orders', mongoFuncs.createOrder);
} else {




























  const bodyParser = require('body-parser');
  const fs = require('fs');

  const path = require('path');
  const readline = require('readline');

  const {
    createDirectory,
    createFile,
    createSchema,
    readJsonFile,
    readOrderStatus,
    updateDirectoryName,
    updateFileName,
    deleteFile,
    deleteFolder,
    appendSchema,
    updateJsonKeys,
    updateJsonValues,
    rl,
    DirFlag,
    fileFlag,
    directoryPath,
    newDirname,
    mainDirPath
  } = require("./jsonwala");
  // Middleware to parse JSON bodies
  app.use(bodyParser.json());







  // Load products and orders data from JSON files
  let products = JSON.parse(fs.readFileSync('products.json'));
  let orders = JSON.parse(fs.readFileSync('orders.json'));

  // Endpoint to get all products
  app.get('/products', (req, res) => {
    res.json(products);
  });

  // Endpoint to search for products by name
  app.get('/search', (req, res) => {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    readJsonFile("products.json", (err, data) => {
      if (err) {
        console.error('Error reading products file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      try {
        // const products = JSON.parse(data);
        const products = data;
        // Filter products based on the product name
        const filteredProducts = products.find(product => product.name.toLowerCase() === name.toLowerCase());
        res.json(filteredProducts);
      } catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  });
  // app.get('/search', (req, res) => {
  //   const { name } = req.query;

  //   if (!name) {
  //       return res.status(400).json({ error: "Product name is required" });
  //   }

  //   fs.readFile('products.json','utf8', (err, data) => {
  //       if (err) {
  //           console.error("Error reading JSON file:", err);
  //           return res.status(500).json({ error: "Internal server error" });
  //       }

  //       try {
  //           const products = JSON.parse(data);
  //           const product = products.find(product => product.name.toLowerCase() === name.toLowerCase());

  //           if (!product) {
  //               return res.status(404).json({ error: "Product not found" });
  //           }

  //           res.json(product);
  //       } catch (parseError) {
  //           console.error("Error parsing JSON data:", parseError);
  //           res.status(500).json({ error: "Internal server error" });
  //       }
  //   });
  // });
  // Endpoint to search orders by status
  app.get('/order-status/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    readOrderStatus(orderId, (order) => {
      if (order) {
        res.json({ order_id: order.order_id, status: order.status });
      } else {
        res.status(404).json({ error: `Order with ID ${orderId} not found.` });
      }
    });
  });










  // Endpoint to place an order
  app.post('/orders', (req, res) => {
    const { products: orderedProducts } = req.body;
    const order = {
      id: orders.length + 1,
      products: orderedProducts,
      status: 'Pending'
    };
    orders.push(order);
    fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
    res.json(order);
  });

  // Endpoint to get all orders
  app.get('/orders', (req, res) => {
    res.json(orders);
  });

  // Endpoint to checkout an order
  app.put('/orders/:id/checkout', (req, res) => {
    const { id } = req.params;
    const order = orders.find(order => order.id === parseInt(id));
    const product = products.find(product => product.id === parseInt(id));
    if (order) {
      order.status = 'Checked Out';

      fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
      res.json({ message: 'Order checked out successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  });

  // Endpoint to update product information
  app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const index = products.findIndex(product => product.id === parseInt(id));
    if (index !== -1) {
      products[index] = { ...products[index], name, price, description };
      fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
      res.json(products[index]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  });

  // Endpoint to cancel an order
  app.delete('/orders/:id', (req, res) => {
    const { id } = req.params;
    const index = orders.findIndex(order => order.id === parseInt(id));
    if (index !== -1) {
      orders.splice(index, 1);
      fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
      res.json({ message: 'Order cancelled successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  });

  // Endpoint to allow sellers to add a new product
  app.post('/products', (req, res) => {
    const { name, price, description, image } = req.body;
    const newProduct = {
      id: products.length + 1,
      name,
      price,
      description,
      image
    };
    products.push(newProduct);
    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
    res.json(newProduct);
  });

}










const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});