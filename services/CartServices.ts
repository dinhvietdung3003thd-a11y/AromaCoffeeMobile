import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "cart";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

export async function getCart(): Promise<CartItem[]> {
  const data = await AsyncStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveCart(cart: CartItem[]) {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export async function addToCart(item: CartItem) {
  const cart = await getCart();

  const index = cart.findIndex((x) => x.productId === item.productId);

  if (index >= 0) {
    cart[index].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  await saveCart(cart);
  await AsyncStorage.setItem("cart_updated", Date.now().toString());
}

export async function removeFromCart(productId: number) {
  const cart = await getCart();
  const newCart = cart.filter((x) => x.productId !== productId);
  await saveCart(newCart);
  await AsyncStorage.setItem("cart_updated", Date.now().toString());
}

export async function updateQuantity(productId: number, quantity: number) {
  const cart = await getCart();

  const index = cart.findIndex((x) => x.productId === productId);

  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
  }

  await saveCart(cart);
  await AsyncStorage.setItem("cart_updated", Date.now().toString());
}

export async function clearCart() {
  await AsyncStorage.removeItem(CART_KEY);
}

export function getTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export async function addManyToCart(items: CartItem[]) {
  const cart = await getCart();

  for (const item of items) {
    const index = cart.findIndex((x) => x.productId === item.productId);

    if (index >= 0) {
      cart[index].quantity += item.quantity;
    } else {
      cart.push(item);
    }
  }

  await saveCart(cart);
}