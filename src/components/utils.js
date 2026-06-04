import { sum } from "ramda";

export const cartTotalOf = (products, priceKey, cartItems = {}) =>
  sum(
    products.map(product => product[priceKey] * (cartItems[product.slug] || 0))
  );
