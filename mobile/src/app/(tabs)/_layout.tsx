import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function TabsLayout() {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "Menu" }}
      />

      <Tabs.Screen
        name="cart"
        options={{ title: "Cart" }}
      />

      <Tabs.Screen
        name="orders"
        options={{ title: "Orders" }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: "Profile" }}
      />
    </Tabs>
  );
}