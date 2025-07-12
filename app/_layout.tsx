import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from './login';
import { StoresContext, StoresProvider } from '@/contexts/StoresContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <LayoutRouter />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function LayoutRouter() {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <StoresProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="item-details" options={{ title: 'Item Details' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </StoresProvider>
  );
}