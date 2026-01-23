const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// --- CREAR VENTA (Con lógica de Niveles) ---
exports.createSale = async (req, res) => {
  const { customerId, items } = req.body;

  try {
    let total = 0;
    
    // 1. Calcular total base y restar stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para ${product ? product.name : 'producto'}` });
      }
      product.stock -= item.quantity;
      await product.save();
      total += product.price * item.quantity;
    }

    // 2. Lógica de Niveles (ACTUALIZADA: Reglas Cafecito Feliz)
    let discountPercent = 0;
    
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (customer) {
        const count = customer.purchasesCount;
        
        // Regla 4: VIP (8+ compras) -> 15%
        if (count >= 8) {
          discountPercent = 15;
        } 
        // Regla 3: Frecuente (4-7 compras) -> 10%
        else if (count >= 4) {
          discountPercent = 10;
        } 
        // Regla 2: Retorno (1-3 compras) -> 5%
        else if (count >= 1) {
          discountPercent = 5;
        }
        // Regla 1: Nuevo (0 compras) -> 0% (Ya estaba en 0 por defecto)

        // Aumentamos su contador de visitas PARA LA PRÓXIMA
        customer.purchasesCount += 1;
        await customer.save();
      }
    }

    // 3. Aplicar Matemáticas
    const discountAmount = (total * discountPercent) / 100;
    const finalTotal = total - discountAmount;

    // 4. Guardar Venta
    const sale = new Sale({
      customerId: customerId || null,
      items,
      subtotal: total,
      discountPercent,
      discountAmount,
      total: finalTotal
    });

    await sale.save();

    res.status(201).json({ message: 'Venta registrada', ticket: sale });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// --- OBTENER HISTORIAL (Dashboard) ---
exports.getSales = async (req, res) => {
  try {
    // Traemos las ventas y "reemplazamos" los IDs por nombres reales
    const sales = await Sale.find()
      .populate('customerId', 'name email') // Trae el nombre del cliente
      .populate('items.productId', 'name')  // Trae el nombre del producto
      .sort({ createdAt: -1 }); // Las más nuevas primero

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};