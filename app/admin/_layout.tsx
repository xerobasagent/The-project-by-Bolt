import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="employees" />
      <Stack.Screen name="clients" />
      <Stack.Screen name="timesheets" />
    </Stack>
  );
}