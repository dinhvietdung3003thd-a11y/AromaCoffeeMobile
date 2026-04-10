import { API_BASE_URL } from "./api";
import { getToken } from "./AuthServices";

export type Product = {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  description?: string | null;
  categoryName?: string | null;
  isAvailable?: boolean;
};

async function parseResponse(response: Response) {
  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    console.log("Product API error:", JSON.stringify(data, null, 2));
    throw new Error(data?.message || data?.title || "Không thể tải sản phẩm");
  }

  return data;
}

export async function getProductsApi(): Promise<Product[]> {
  const token = await getToken();

  const response = await fetch(`${API_BASE_URL}/Product`, {
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

export async function searchProductsElasticApi(keyword: string): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/Product/search-elastic?keyword=${encodeURIComponent(keyword)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await parseResponse(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

export async function getProductByIdApi(productId: number): Promise<Product> {
  const token = await getToken();

  const response = await fetch(`${API_BASE_URL}/Product/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseResponse(response);

  if (data?.data) return data.data;
  return data;
}