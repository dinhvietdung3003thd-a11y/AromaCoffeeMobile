import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./api";

type LoginRequest = {
  username: string;
  password: string;
};

type RegisterRequest = {
  username: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
};

const TOKEN_KEY = "token";

async function parseResponse(response: Response) {
  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    console.log("API error response:", JSON.stringify(data, null, 2));

    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      const firstMessage = data.errors[firstKey]?.[0];
      throw new Error(firstMessage || "Dữ liệu không hợp lệ");
    }

    throw new Error(data?.message || data?.title || "Yêu cầu thất bại");
  }

  return data;
}

export async function customerLoginApi({ username, password }: LoginRequest) {
  const response = await fetch(`${API_BASE_URL}/Auth/customer/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return await parseResponse(response);
}

export async function customerRegisterApi({
  username,
  password,
  fullName,
  phoneNumber,
  email,
}: RegisterRequest) {
  const response = await fetch(`${API_BASE_URL}/Auth/customer/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      fullName,
      phoneNumber: phoneNumber?.trim() || null,
      email: email?.trim() || null,
    }),
  });

  return await parseResponse(response);
}

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function isLoggedIn() {
  const token = await getToken();
  return !!token;
}

export async function getAuthHeaders() {
  const token = await getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}