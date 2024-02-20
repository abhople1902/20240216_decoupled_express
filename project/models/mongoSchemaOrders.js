// const Product = require('./products.json');
const mongoose = require('mongoose');

//Schema
const orderSchema = new mongoose.Schema({
  O_id: {
    type: Number,
  },
  O_date: {
    type: Date
  },
  O_address: {
    type: String
  },
  O_P_id: {
    type: Number
  },
  O_Status: {
    type: String
  },
  O_qty: {
    type: Number
  },
  O_TotalCost: {
    type: Number
  }
},
  {
    timestamps: true
  }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;