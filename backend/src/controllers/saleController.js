const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

exports.createSale = async (req, res) => {
  try {
    const { customerId, items } = req.body;

    // 1. Calcular Descuento según reglas de negocio
    let discountPercent = 0;
    let customer = null;

    if (customerId) {
      customer = await Customer.findById(customerId);
      if (customer) {
        const count = customer.purchasesCount;
        if (count >= 1 && count <= 3) discountPercent = 5;
        else if (count >= 4 && count <= 7) discountPercent = 10;
        else if (count >= 8) discountPercent = 15;
      }
    }

    // 2. Validar productos, stock y calcular totales
    let subtotal = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ error: `Producto no encontrado: ${item.productId}` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para: ${product.name}` });
      }

      // Restar stock
      product.stock -= item.quantity;
      await product.save();

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      saleItems.push({
        productId: product._id,
        quantity: item.quantity,
        unitPriceSnapshot: product.price,
        lineTotal: lineTotal
      });
    }

    // 3. Calcular montos finales
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;

    // 4. Guardar la venta
    const newSale = new Sale({
      customerId: customerId || null,
      items: saleItems,
      subtotal,
      discountPercent,
      discountAmount,
      total
    });

    await newSale.save();

    // 5. Actualizar contador del cliente (si existe)
    if (customer) {
      customer.purchasesCount += 1;
      await customer.save();
    }

    // 6. Responder
    res.status(201).json({ 
      message: 'Venta exitosa', 
      ticket: newSale,
      nextDiscount: customer ? `Llevas ${customer.purchasesCount} compras` : 'Sin registro'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la venta' });
  }
};