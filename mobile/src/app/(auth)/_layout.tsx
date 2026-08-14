import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (token) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="register"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}