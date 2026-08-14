const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
};

export type MenuCategory = {
  id: number;
  name: string;
  restaurantId: number;
  menuItems: MenuItem[];
};

export type CreateOrderItem = {
  menuItemId: number;
  quantity: number;
};

export type CreateOrderResponse = {
  id: number;
  status: string;
  total: number;
};

export type OrderItem = {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};



export async function getRestaurantMenu(
  restaurantId: number
) {
  return request<MenuCategory[]>(
    `/restaurants/${restaurantId}/menu`
  );
}

export async function createOrder(
  token: string,
  items: CreateOrderItem[]
) {
  return request<CreateOrderResponse>("/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });
}

export async function getMenuItem(id: number) {
  return request<MenuItem>(`/menu/${id}`);
}

export async function getOrders(token: string) {
  return request<Order[]>("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getOrder(
  token: string,
  id: number
) {
  return request<Order>(`/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}