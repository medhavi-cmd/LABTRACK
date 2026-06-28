export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (component) => {
  let cart = getCart();

  const existing = cart.find(
    (item) => item.component_id === component.component_id
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...component,
      quantity: 1,
    });
  }

  saveCart(cart);
};

export const getCartCount = () => {
  const cart = getCart();

  return cart.reduce((total, item) => total + item.quantity, 0);
};