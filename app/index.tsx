import { Redirect } from 'expo-router';

export default function Index() {
  // This tells the app: "As soon as you open, go straight to /Login"
  return <Redirect href="/Login" />;
}