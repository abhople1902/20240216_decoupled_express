// const Product = require('./products.json');
const mongoose = require('mongoose');

//Schema
const productSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  stock: {
    type: Number
  },
  image: {
    type: String
  },
},
  {
    timestamps: true
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;