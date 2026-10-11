import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSchool } from '@school/core';
import { Toast } from '../components/Toast';
import { colors } from '../components/theme';

export default function RootLayout() {
  const init = useSchool((s) => s.init);
  useEffect(() => { void init(); }, [init]);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerTintColor: colors.text, headerStyle: { backgroundColor: colors.surface }, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="conversation" options={{ title: '', headerBackTitle: 'Back' }} />
        <Stack.Screen name="search" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <Toast />
    </View>
  );
}
