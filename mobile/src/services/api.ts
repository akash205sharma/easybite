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

export async function getRestaurantMenu(
  restaurantId: number
) {
  return request<MenuCategory[]>(
    `/restaurants/${restaurantId}/menu`
  );
}