// backend/src/utils/responseHandler.js

// Función para transformar un objeto Mongoose (camelCase) a API (snake_case)
const formatResource = (resource) => {
  const obj = resource.toObject ? resource.toObject() : resource;
  
  // Transformaciones manuales para cumplir el contrato
  return {
    id: obj._id, // El contrato pide 'id', no '_id'
    name: obj.name,
    price: obj.price,
    stock: obj.stock,
    phone_or_email: obj.phoneOrEmail, // snake_case
    purchases_count: obj.purchasesCount, // snake_case
    created_at: obj.createdAt, // snake_case
    updated_at: obj.updatedAt  // snake_case
  };
};

exports.success = (res, status, data) => {
  res.status(status).json(data);
};

exports.error = (res, status, message, details = null) => {
  const response = { error: message };
  if (details) response.details = details;
  res.status(status).json(response);
};

exports.formatResource = formatResource;