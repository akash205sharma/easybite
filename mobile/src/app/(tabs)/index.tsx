import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useCart } from "@/context/CartContext";
import FoodCard from "@/components/FoodCard";
import {
  getRestaurantMenu,
  MenuCategory,
} from "@/services/api";

export default function HomeScreen() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();


  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      setLoading(true);
      setError("");

      const data = await getRestaurantMenu(1);

      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading menu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadMenu}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  const sections = categories.map((category) => ({
    title: category.name,
    data: category.menuItems,
  }));

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            onPress={() =>
              router.push(`/menu/${item.id}`)
            }
            onAdd={() => {
              addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
              });
            }}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>
            {section.title}
          </Text>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>
              Good morning 👋
            </Text>

            <Text style={styles.restaurant}>
              EasyBite
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No food available
            </Text>

            <Text style={styles.emptyText}>
              The restaurant menu is currently empty.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  list: {
    padding: 20,
    paddingBottom: 100,
  },

  header: {
    marginBottom: 8,
  },

  greeting: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },

  restaurant: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111",
    marginTop: 16,
    marginBottom: 12,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  errorText: {
    color: "#666",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 14,
  },

  retryButton: {
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: "#fff",
    fontWeight: "700",
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    color: "#777",
    marginTop: 6,
    textAlign: "center",
  },
});