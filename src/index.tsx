import { Redirect } from 'expo-router';

export default function Index() {
  // Use a capital 'L' to match your filename 'Login.tsx'
  return <Redirect href="/login" />;
}