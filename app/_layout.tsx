import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  // This ensures that if the app reloads, it anchors to the tabs group
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    // Force the navigation background to be the deep navy color
    <ThemeProvider value={DarkTheme}>
      <View style={{ flex: 1, backgroundColor: '#020617' }}>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            // The contentStyle ensures no white flicker during screen transitions
            contentStyle: { backgroundColor: '#020617' } 
          }}
        >
          {/* This matches your login screen (usually index.tsx in the root app folder) */}
          <Stack.Screen name="index" /> 
          
          {/* This matches your (tabs) folder which contains home.tsx */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}