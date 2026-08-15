import { router } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <View style={styles.center}>
                <Text>Unable to load profile</Text>
            </View>
        );
    }

    async function handleLogout() {
        await logout();
        router.replace("/login");
    }

    const initial = user.name
        ? user.name.charAt(0).toUpperCase()
        : "?";

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Text style={styles.title}>Profile</Text>

            {/* Profile Header */}
            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {initial}
                    </Text>
                </View>

                <Text style={styles.name}>
                    {user.name}
                </Text>

                <Text style={styles.email}>
                    {user.email}
                </Text>
            </View>

            {/* Admin Management */}
            {user.role === "ADMIN" && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Restaurant Management
                    </Text>

                    <Pressable
                        style={styles.managementButton}
                        onPress={() =>
                            router.push("/admin/orders")
                        }
                    >
                        <View style={styles.buttonIcon}>
                            <Text style={styles.iconText}>
                                ≡
                            </Text>
                        </View>

                        <View style={styles.buttonContent}>
                            <Text
                                style={
                                    styles.buttonTitle
                                }
                            >
                                Restaurant Orders
                            </Text>

                            <Text
                                style={
                                    styles.buttonSubtitle
                                }
                            >
                                Manage incoming orders
                            </Text>
                        </View>

                        <Text style={styles.arrow}>
                            ›
                        </Text>
                    </Pressable>
                </View>
            )}

            {/* Customer Actions */}
            {user.role !== "ADMIN" && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Your Activity
                    </Text>

                    <Pressable
                        style={styles.actionButton}
                        onPress={() =>
                            router.push("/orders")
                        }
                    >
                        <View
                            style={styles.actionIcon}
                        >
                            <Text
                                style={
                                    styles.actionIconText
                                }
                            >
                                ◷
                            </Text>
                        </View>

                        <View style={styles.buttonContent}>
                            <Text
                                style={
                                    styles.actionTitle
                                }
                            >
                                My Orders
                            </Text>

                            <Text
                                style={
                                    styles.buttonSubtitle
                                }
                            >
                                View your previous orders
                            </Text>
                        </View>

                        <Text style={styles.arrowDark}>
                            ›
                        </Text>
                    </Pressable>
                </View>
            )}

            {/* Account */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    Account
                </Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Name
                        </Text>

                        <Text style={styles.infoValue}>
                            {user.name}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Email
                        </Text>

                        <Text
                            style={styles.infoValue}
                            numberOfLines={1}
                        >
                            {user.email}
                        </Text>
                    </View>
                </View>
            </View>

            {/* App */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    About
                </Text>

                <View style={styles.aboutCard}>
                    <Text style={styles.appName}>
                        EasyBite
                    </Text>

                    <Text style={styles.aboutText}>
                        Simple food ordering for a
                        seamless restaurant experience.
                    </Text>

                    <Text style={styles.version}>
                        Version 1.0.0
                    </Text>
                </View>
            </View>

            {/* Logout */}
            <Pressable
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>
                    Log Out
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 24,
    },

    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 26,
        alignItems: "center",
    },

    avatar: {
        width: 78,
        height: 78,
        borderRadius: 39,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },

    avatarText: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "800",
    },

    name: {
        fontSize: 23,
        fontWeight: "800",
    },

    email: {
        color: "#666",
        fontSize: 15,
        marginTop: 5,
    },

    section: {
        marginTop: 26,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
    },

    managementButton: {
        backgroundColor: "#111",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },

    buttonContent: {
        flex: 1,
        marginLeft: 12,
    },

    buttonIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#333",
        alignItems: "center",
        justifyContent: "center",
    },

    iconText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },

    buttonTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    buttonSubtitle: {
        color: "#777",
        fontSize: 13,
        marginTop: 4,
    },

    arrow: {
        color: "#fff",
        fontSize: 28,
        marginLeft: 8,
    },

    actionButton: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee",
    },

    actionIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },

    actionIconText: {
        fontSize: 23,
        fontWeight: "700",
    },

    actionTitle: {
        fontSize: 16,
        fontWeight: "700",
    },

    arrowDark: {
        color: "#111",
        fontSize: 28,
        marginLeft: 8,
    },

    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingHorizontal: 16,
    },

    infoRow: {
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    infoLabel: {
        color: "#777",
        fontSize: 14,
    },

    infoValue: {
        fontSize: 14,
        fontWeight: "600",
        maxWidth: "65%",
    },

    divider: {
        height: 1,
        backgroundColor: "#eee",
    },

    aboutCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
    },

    appName: {
        fontSize: 18,
        fontWeight: "800",
    },

    aboutText: {
        color: "#666",
        lineHeight: 20,
        marginTop: 6,
    },

    version: {
        color: "#999",
        fontSize: 12,
        marginTop: 12,
    },

    logoutButton: {
        marginTop: 28,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 14,
        padding: 16,
        alignItems: "center",
    },

    logoutText: {
        fontSize: 16,
        fontWeight: "700",
    },
});