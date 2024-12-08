import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "@screens/HomeScreen";
import PostScreen from "@screens/PostScreen";
import ROUTE from "@routes/index.js";

const Stack = createNativeStackNavigator();

const HomeNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTE.HOMESCREENS.HOME} component={HomeScreen} />
        <Stack.Screen
          name={ROUTE.HOMESCREENS.POST}
          component={PostScreen}
          options={{
            headerShown: true,
            title: "Post Details",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeNavigation;

const styles = StyleSheet.create({});
