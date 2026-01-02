import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text>This is the G-Vault App - If you see this, routing is working!</Text>
      <Link href="/login">Go to Login</Link>
    </View>
  );
}