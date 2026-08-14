import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FoodCardProps = {
  item: {
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onPress: () => void;
};

export default function FoodCard({
  item,
  onPress,
}: FoodCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.bottom}>
          <Text style={styles.price}>₹{item.price}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onPress}
          >
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
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