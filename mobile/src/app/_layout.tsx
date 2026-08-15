import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();


import { Redirect, Stack } from "expo-router";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!token) {
    return (
      <Stack>
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="menu/[id]"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="cart"
        options={{ title: "Cart" }}
      />

      <Stack.Screen
        name="checkout"
        options={{ title: "Checkout" }}
      />

      <Stack.Screen
        name="order/[id]"
        options={{ title: "Order Status" }}
      />

      <Stack.Screen
        name="admin/orders"
        options={{
          title: "Restaurant Orders",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootNavigator />
      </CartProvider>
    </AuthProvider>
  );
}