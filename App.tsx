import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useAppFonts, ThemeProvider, useStyles, useTheme, ThemeColors } from '@nocturnalflow/design-system';
import { RootNavigator } from './src/navigation/RootNavigator';
import { buildNavigationTheme } from './src/navigation/navigationTheme';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const styles = useStyles(makeStyles);
  const { themeName, colors } = useTheme();
  const barStyle = themeName === 'dark' ? 'light' : 'dark';
  const [fontsLoaded] = useAppFonts();
  const navigationTheme = useMemo(() => buildNavigationTheme(colors, themeName), [colors, themeName]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.root}>
          <NavigationContainer theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style={barStyle} />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
