import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AuthProvider, useAuth } from './Contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './Navigator';
import FlashMessage from "react-native-flash-message";
import Toast from 'react-native-toast-message';

const AppContent = () => {
  const { loadAuthData } = useAuth();

  return (
    <NavigationContainer onStateChange={loadAuthData}>
      <Navigator />
      <Toast />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
