import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { SnackbarProvider } from './src/components/CustomSnackbar';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <AuthProvider>
        <SnackbarProvider>
          <AppNavigator />
        </SnackbarProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
