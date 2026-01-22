export interface Product {
  _id: string; // MongoDB usa _id, no id
  name: string;
  price: number;
  stock: number;
}