import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, Touchable, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import useHome from '../Hooks/useHome';
import { useAuth } from "../Contexts/AuthContext";
import { useNavigation } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";

const Myprofile = () => {
  const navigation = useNavigation();
  const { isAuthenticated, userData, logout, authLoading } = useAuth();

  if (authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.main}>
          <View style={styles.Box}>
            <View style={{ justifyContent: "center", alignItems: "center", width: 350, height: 460 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Yükleniyor...</Text>
            </View>
          </View>
        </View>
        <Footer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.main}>
        {isAuthenticated && userData ? (
          <View style={styles.Box}>
            {userData.avatar ? (
              <Image style={styles.Avatar} source={{ uri: userData.avatar }} />
            ) : (
              <Text>Avatar yüklenemedi</Text>
            )}
            <Text>İsim: {userData.name}</Text>
            <Text>Rol: {userData.role}</Text>
            <TouchableOpacity
              style={styles.EditButton}
              onPress={async () => {
                navigation.navigate("editprofile");
              }}
            >
              <Text style={{ textAlign: "center", fontWeight: 'bold', color: '#fff' }}>Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.LogoutButton}
              onPress={async () => {
                await logout();
                navigation.navigate("login");
                showMessage({
                  message: "Başarıyla Çıkış Yapıldı",
                  type: "success",
                });
              }}
            >
              <Text style={{ textAlign: "center", fontWeight: 'bold', color: '#fff' }}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>Giriş yapınız</Text>
        )}
      </View>
      <Footer />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  main: {
    overflow: 'hidden',
    flex: 1,
    backgroundColor: '#B7B597',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Box: {
    width: 350,
    height: 500,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10
  },
  LogoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  EditButton: {
    backgroundColor: '#12CCFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default Myprofile;
