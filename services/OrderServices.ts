import { API_BASE_URL } from "./api";
import { getToken } from "./AuthServices";
import { CartItem } from "./CartServices";

async function parseResponse(response: Response) {
  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  console.log("ORDER STATUS:", response.status);
  console.log("ORDER RESPONSE:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    if (data?.errors) {
      const allErrors = Object.values(data.errors).flat().join("\n");
      throw new Error(allErrors || "Đặt hàng thất bại");
    }

    throw new Error(data?.message || data?.title || "Đặt hàng thất bại");
  }

  return data;
}

export async function createOrderFromCart(cart: CartItem[], note?: string) {
  const token = await getToken();

  const payload = {
    details: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    note: note?.trim() || ""
  };

  console.log("ORDER PAYLOAD:", JSON.stringify(payload, null, 2));

  const response = await fetch(`${API_BASE_URL}/client/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  return await parseResponse(response);
}