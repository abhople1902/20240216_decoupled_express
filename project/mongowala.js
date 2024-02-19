// const Product = require('./products.json');
const mongoose = require('mongoose');

const Product = require('./mongoSchemaProducts.js')
const Order = require('./mongoSchemaOrders.js')

// Create a new product
exports.createProduct = async (req, res) => {
  const body = req.body;
  if (
    !body.id ||
    !body.name ||
    !body.description ||
    !body.price ||
    !body.stock ||
    !body.image
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const result = await Product.create({
    id: body.id,
    name: body.name,
    description: body.description,
    price: body.price,
    stock: body.stock,
    image: body.image
  });
  return res.status(201).json({ msg: "success" });
};

// Get all products
exports.getAllProducts = async (req, res) => {
  const allProducts = await Product.find({});
  const html = `
  <ul>
  ${allProducts.map(product => `<li>${product.name} - ${product.description}</li>`).join('')}
  </ul>
  `;
  res.send(html);
};

// Get product by ID
exports.getProductById = async (req, res) => {
  const prod = await Product.findById(req.params.id);
  if(!prod) {
    return res.status(404).json({error: "Product not found"});
  } else {
    return res.json(prod);
  }
};

// Update product by ID
exports.updateProductById = async (req, res) => {
  const newProd = await Product.findByIdAndUpdate(req.params.id, req.body);
  console.log(newProd)
  return res.json({ msg: "success" }, { status: 200 }, { newProd });
};

// Delete product by ID
exports.deleteProductById = async (req, res) => {
  Product.findByIdAndDelete(req.params.id);
  return res.json({ msg: "success" });
};




/**
 * Functions for Order collection manipulation
 */
exports.createOrder = async (req, res) => {
  const body = req.body;
  if (
    !body.O_id ||
    !body.O_date ||
    !body.O_address ||
    !body.O_P_id ||
    !body.O_Status ||
    !body.O_qty ||
    !body.O_TotalCost
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const result = await Order.create({
    O_id: body.O_id,
    O_date: body.O_date,
    O_address: body.O_address,
    O_P_id: body.O_P_id,
    O_Status: body.O_Status,
    O_qty: body.O_qty,
    O_TotalCost: body.O_TotalCost
  });
  return res.status(201).json({ msg: "success" });
};