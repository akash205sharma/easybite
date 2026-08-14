import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import FoodCard from "@/components/FoodCard";
import {
  getRestaurantMenu,
  MenuCategory,
} from "@/services/api";

export default function HomeScreen() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      setLoading(true);

      const data = await getRestaurantMenu(1);

      setCategories(data);
      console.log(categories)
    } catch (err) {
      console.error(err);
      setError("Failed to load menu");
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
        <Text>{error}</Text>
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
             onPress={() => router.push(`/menu/${item.id}`)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>
            {section.title}
          </Text>
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.greeting}>
              Good morning 👋
            </Text>

            <Text style={styles.restaurant}>
              EasyBite
            </Text>

            <TextInput
              placeholder="Search food..."
              style={styles.search}
            />
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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

  greeting: {
    fontSize: 14,
    color: "#666",
  },

  restaurant: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 20,
  },

  search: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 10,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
  },
});