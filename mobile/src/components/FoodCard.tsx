import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";

type FoodCardProps = {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onPress: () => void;
  onAdd: () => void;
};

export default function FoodCard({
  item,
  onPress,
  onAdd,
}: FoodCardProps) {


  const [added, setAdded] = useState(false);

  function handleAdd() {
    onAdd();

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1200);
  }

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
      </Pressable>

      <View style={styles.content}>
        <Pressable onPress={onPress}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <Text
            style={styles.description}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </Pressable>

        <View style={styles.bottom}>
          <Text style={styles.price}>
            ₹{item.price}
          </Text>

          <Pressable
            style={[
              styles.button,
              added && styles.addedButton,
            ]}
            onPress={handleAdd}
          >
            <Text
              style={[
                styles.buttonText,
                added && styles.addedButtonText,
              ]}
            >
              {added ? "✓ ADDED" : "ADD"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  addedButton: {
    backgroundColor: "#e8f5e9",
    borderColor: "#c8e6c9",
  },

  addedButtonText: {
    color: "#2e7d32",
  },

  image: {
    width: 110,
    height: 110,
  },

  content: {
    flex: 1,
    padding: 12,
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
  },

  description: {
    color: "#666",
    marginTop: 4,
    fontSize: 13,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
  },

  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  buttonText: {
    fontWeight: "700",
  },
});