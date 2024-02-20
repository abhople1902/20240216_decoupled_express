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


///////////ORDERS

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

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order by ID
exports.updateOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { user, products, totalPrice } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { user, products, totalPrice },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete order by ID
exports.cancelOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(deletedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Checkout Order
// exports.checkout = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { user, products } = req.body;

//     // Iterate through the products in the order
//     for (const { productId, quantity } of products) {
//       // Find the product by its ID
//       const product = await Product.findById(productId).session(session);
//       if (!product) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(404).json({ error: `Product with ID ${productId} not found` });
//       }

//       // Check if the available stock is sufficient for the order
//       if (product.stock < quantity) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
//       }

//       // Update the stock of the product
//       product.stock -= quantity;
//       await product.save({ session });
//     }

//     // Create the order
//     const totalPrice = products.reduce((acc, { productId, quantity }) => {
//       const product = products.find(p => p.productId === productId);
//       return acc + (product.price * quantity);
//     }, 0);

//     const newOrder = new Order({ user, products, totalPrice });
//     await newOrder.save({ session });

//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({ message: 'Checkout successful' });
//   } catch (error) {
//     // Rollback the transaction in case of an error
//     await session.abortTransaction();
//     session.endSession();

//     res.status(500).json({ error: error.message });
//   }
// };

exports.checkout = async (req, res) => {
  try {
    // const { O_id, O_address, O_P_id, O_qty, O_TotalCost } = req.body;
    const body = req.body;

    // Create a new order
    const newOrder = new Order({
      _id,
      O_address,
      O_P_id,
      O_qty,
      O_TotalCost
    });

    // Save the order to the database
    await newOrder.save();

    // Update the stock of the products being ordered
    for (const { O_id, O_qty } of body) {
      const product = await Product.findById({ _id });
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      product.stock -= O_qty;
      await product.save();
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};