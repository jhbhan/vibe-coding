import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from './login';
import { StoresContext, StoresProvider } from '@/contexts/StoresContext';
import { ItemsProvider } from '@/contexts/ItemsContext';

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
      <ItemsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="item-details" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ItemsProvider>
    </StoresProvider>
  );
}