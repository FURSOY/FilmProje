import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import useWatchList from '../Hooks/useWatchList';
import { useAuth } from "../Contexts/AuthContext";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const WatchList = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const navigation = useNavigation();
  const { watchedList, WatchedListOperation, WatchListOperation } = useWatchList();
  const { isAuthenticated, authLoading, loadAuthData } = useAuth();

  if (authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.main}>
          <View style={styles.main}>
            <View style={{ backgroundColor: "#fff", width: 350, height: 500, borderRadius: 15 }}>
              <View style={{ backgroundColor: '#d9d9d9', height: 40, justifyContent: 'center', borderTopStartRadius: 15, borderTopEndRadius: 15 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 22, marginLeft: 20 }}>İzlediklerim Listesi</Text>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center", width: 350, height: 460 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Yükleniyor...</Text>
              </View>
            </View>
          </View>
        </View>
        <Footer />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.main}>
          <View style={styles.main}>
            <View style={{ backgroundColor: "#fff", width: 350, height: 500, borderRadius: 15 }}>
              <View style={{ backgroundColor: '#d9d9d9', height: 40, justifyContent: 'center', borderTopStartRadius: 15, borderTopEndRadius: 15 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 22, marginLeft: 20 }}>İzlediklerim Listesi</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("login")}>
                <Text>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Footer />
      </SafeAreaView>
    );
  }

  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.main}>
        <View style={{ backgroundColor: "#fff", width: 350, height: 500, borderRadius: 15 }}>
          <View style={{ backgroundColor: '#d9d9d9', height: 40, justifyContent: 'center', borderTopStartRadius: 15, borderTopEndRadius: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 22, marginLeft: 20 }}>İzlediklerim Listesi</Text>
          </View>
          <ScrollView style={styles.MessagesContainer} key={refreshKey}>
            {watchedList.map((film, index) => (
              <View key={index} style={styles.MessageBox}>
                <View style={styles.TextView}>
                  <Image style={styles.MessageBoxImage} source={{ uri: `http://img.omdbapi.com/?apikey=fa0806f5&i=${film.tconst}` }} />
                  <TouchableOpacity onPress={() => navigation.navigate("home")}>
                    <Text style={styles.MessageText}>{film.originalTitle}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
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
  MessagesContainer: {
    width: 350,
    height: 460,
    overflow: 'hidden',
  },
  MessageBox: {
    borderBottomWidth: 2,
    borderColor: '#d9d9d9',
    height: 150,
    alignItems: "center",
    flexDirection: "row",
    position: 'relative',
    paddingLeft: 15,
    justifyContent: 'space-between',
    paddingRight: 15
  },
  MessageBoxImage: {
    width: 96,
    height: 144,
    marginRight: 10
  },
  MessageText: {
    margin: 0,
    fontSize: 20,
  },
  PlusButton: {
    backgroundColor: 'green',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  NegativeButton: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20
  },
  ButtonView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  TextView: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default WatchList;
