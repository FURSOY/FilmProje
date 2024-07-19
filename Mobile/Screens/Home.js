import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Button } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import useHome from '../Hooks/useHome';
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const { Messages, loading, refreshMessages } = useHome();

  useFocusEffect(
    React.useCallback(() => {
      refreshMessages();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.main}>
          <View style={styles.main}>
            <View style={{ backgroundColor: "#fff", width: 350, height: 500, borderRadius: 15 }}>
              <View style={{ backgroundColor: '#d9d9d9', height: 40, justifyContent: 'center', borderTopStartRadius: 15, borderTopEndRadius: 15 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 22, marginLeft: 20 }}>Öne Çıkanlar</Text>
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

  if (!Messages) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.main}>
          <View style={styles.main}>
            <View style={{ backgroundColor: "#fff", width: 350, height: 500, borderRadius: 15 }}>
              <View style={{ backgroundColor: '#d9d9d9', height: 40, justifyContent: 'center', borderTopStartRadius: 15, borderTopEndRadius: 15 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 22, marginLeft: 20 }}>Öne Çıkanlar</Text>
              </View>
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
            <Text style={{ fontWeight: 'bold', fontSize: 22, marginLeft: 20 }}>Öne Çıkanlar</Text>
          </View>
          <ScrollView style={styles.MessagesContainer}>
            {Messages.map((message, index) => (
              <View key={index} style={styles.MessageBox}>
                <Image style={styles.MessageBoxImage} source={{ uri: message.userInfo.avatar }} />
                {
                  message.type === "signup" ? (
                    <Text style={styles.MessageText} numberOfLines={1} ellipsizeMode="tail">
                      <Text style={{ fontWeight: 'bold' }}>{message.userInfo.name}</Text> hesap oluşturdu
                    </Text>
                  ) : (
                    <Text style={styles.MessageText} numberOfLines={2} ellipsizeMode="tail">
                      <Text style={{ fontWeight: 'bold' }}>{message.userInfo.name}</Text> {message.filmInfo.originalTitle} filmine <Text style={{ fontWeight: 'bold' }}>{message.rate}</Text> puan verdi
                    </Text>
                  )
                }
                <Text style={styles.MessageBoxDate}>{formatCreatedAt(message.createdAt)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
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
  MessagesContainer: {
    width: 350,
    height: 460,
    overflow: 'hidden',
  },
  MessageBox: {
    borderTopWidth: 2,
    borderColor: '#d9d9d9',
    height: 65,
    alignItems: "center",
    flexDirection: "row",
    position: 'relative',
    paddingLeft: 15
  },
  MessageBoxImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  MessageText: {
    margin: 0,
    overflow: "hidden",
    paddingRight: 60,
    fontSize: 12,
  },
  MessageBoxDate: {
    position: "absolute",
    top: 0,
    right: 8,
    fontSize: 10,
    fontWeight: 'bold'
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    color: 'gray',
  },
});

export default Home;
