import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const API_URL = process.env.EXPO_PUBLIC_API_URL;


type User = {
    id: number;
    name: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);


async function getToken() {
    if (Platform.OS === "web") {
        return AsyncStorage.getItem(TOKEN_KEY);
    }

    return SecureStore.getItemAsync(TOKEN_KEY);
}

async function saveToken(token: string) {
    if (Platform.OS === "web") {
        return AsyncStorage.setItem(TOKEN_KEY, token);
    }

    return SecureStore.setItemAsync(TOKEN_KEY, token);
}

async function removeToken() {
    if (Platform.OS === "web") {
        return AsyncStorage.removeItem(TOKEN_KEY);
    }

    return SecureStore.deleteItemAsync(TOKEN_KEY);
}

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredToken();
    }, []);

    async function loadStoredToken() {
        try {
            const storedToken = await getToken();

            if (!storedToken) {
                return;
            }

            const response = await fetch(
                `${API_URL}/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                }
            );

            if (!response.ok) {
                await removeToken();
                return;
            }

            const user = await response.json();

            setToken(storedToken);
            setUser(user);
        } catch {
            await removeToken();
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }

        await saveToken(data.token)

        setToken(data.token);
        setUser(data.user);
    }

    async function register(
        name: string,
        email: string,
        password: string
    ) {
        const response = await fetch(
            `${API_URL}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Registration failed");
        }

        await login(email, password);
    }

    async function logout() {
        await removeToken()

        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}