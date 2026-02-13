const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { error, success } = require('../utils/responseHandler');

// --- CREAR VENTA (Cumpliendo contrato estricto) ---
exports.createSale = async (req, res) => {
  const { customerId, items, paymentMethod = 'cash' } = req.body;

  try {
    if (!items || items.length === 0) {
      return error(res, 422, "Validation failed", [{ field: "items", message: "cannot be empty" }]);
    }

    let subtotal = 0;
    const saleItems = [];

    // 1. Validar Stock, Restar y Calcular Subtotal
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) return error(res, 404, `Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        return error(res, 400, "Insufficient stock", [
          { productId: product._id, message: `Only ${product.stock} available` }
        ]);
      }

      // Restar stock
      product.stock -= item.quantity;
      await product.save();

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      // Guardamos info detallada para el ticket
      saleItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: lineTotal
      });
    }

    // 2. Calcular Descuento
    let discountPercent = 0;
    
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (customer) {
        const count = customer.purchasesCount;
        if (count >= 8) discountPercent = 15;
        else if (count >= 4) discountPercent = 10;
        else if (count >= 1) discountPercent = 5;

        // Actualizar contador
        customer.purchasesCount += 1;
        await customer.save();
      }
    }

    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;

    // 3. Guardar Venta en BD
    const sale = new Sale({
      customerId: customerId || null,
      items: saleItems.map(i => ({ 
          product: i.productId, // Ajusta esto según tu modelo Sale si usas 'productId' o 'product'
          quantity: i.quantity, 
          price: i.unitPrice 
      })), 
      subtotal,
      discountPercent,
      discountAmount,
      total,
      paymentMethod
    });

    await sale.save();

    // 4. CONSTRUIR RESPUESTA COMPLEJA (Según Contrato)
    const responseData = {
      sale_id: sale._id,
      customer_id: customerId,
      payment_method: paymentMethod,
      items: saleItems,
      subtotal: subtotal,
      discount_percent: discountPercent,
      discount_amount: discountAmount,
      total: total,
      created_at: sale.createdAt,
      
      // Objeto Ticket Requerido
      ticket: {
        saleId: sale._id,
        timestamp: sale.createdAt,
        storeName: "Cafecito Feliz",
        items: saleItems.map(i => ({ 
            name: i.productName, 
            qty: i.quantity, 
            unitPrice: i.unitPrice, 
            lineTotal: i.lineTotal 
        })),
        subtotal: subtotal,
        discount: `${discountPercent}% (-$${discountAmount.toFixed(2)})`,
        total: total,
        paymentMethod: paymentMethod
      }
    };

    success(res, 201, responseData);

  } catch (err) {
    console.error(err);
    error(res, 500, "Error en el servidor");
  }
};

// --- OBTENER HISTORIAL ---
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('customerId', 'name email')
      .populate('items.productId', 'name') // Ojo: verifica que en tu modelo Sale sea 'items.productId' o 'items.product'
      .sort({ createdAt: -1 });

    // Mapeo simple para cumplir snake_case en lista
    const formattedSales = sales.map(s => ({
        sale_id: s._id,
        total: s.total,
        created_at: s.createdAt,
        customer_name: s.customerId ? s.customerId.name : 'Cliente Casual'
    }));

    success(res, 200, formattedSales);
  } catch (err) {
    error(res, 500, 'Error al obtener historial');
  }
};