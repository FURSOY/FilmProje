import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AuthProvider, useAuth } from './Contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './Navigator';
import FlashMessage from "react-native-flash-message";

const AppContent = () => {
  const { loadAuthData } = useAuth();

  return (
    <NavigationContainer onStateChange={loadAuthData}>
      <StatusBar />
      <Navigator />
      <FlashMessage position="top" />
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
