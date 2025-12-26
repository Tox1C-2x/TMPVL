import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Index route tumhare pure App.js code ko load karega */}
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
