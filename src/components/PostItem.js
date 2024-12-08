import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ROUTES from "@routes/index";

const PostItem = ({ title, description, id }) => {
  const navigation = useNavigation();

  const handleOnClick = () => {
    navigation.navigate(ROUTES.HOMESCREENS.POST, { id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleOnClick}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});

export default PostItem;
