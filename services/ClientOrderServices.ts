import { API_BASE_URL } from "./api";
import { getToken } from "./AuthServices";

export type ClientOrderItem = {
  orderId: number;
  createdAt?: string;
  orderDate?: string;
  totalAmount?: number;
  total?: number;
  status?: string;
  note?: string | null;
};

async function parseResponse(response: Response) {
  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  console.log("CLIENT ORDER STATUS:", response.status);
  console.log("CLIENT ORDER RESPONSE:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    if (data?.errors) {
      const allErrors = Object.values(data.errors).flat().join("\n");
      throw new Error(allErrors || "Không tải được lịch sử đơn hàng");
    }

    throw new Error(
      data?.message || data?.title || "Không tải được lịch sử đơn hàng"
    );
  }

  return data;
}

export async function getMyOrdersApi(): Promise<ClientOrderItem[]> {
  const token = await getToken();

  const response = await fetch(`${API_BASE_URL}/client/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseResponse(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}