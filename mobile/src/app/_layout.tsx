import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

import { Stack } from "expo-router";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />

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
      </Stack>
    </CartProvider>
  );
}