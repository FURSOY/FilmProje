import React from 'react';
import { StyleSheet, View, Text, strong } from 'react-native';
import SearchHeader from '../components/SearchHeader';
import Footer from '../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';

export default Search = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader />
      <View style={styles.main}>
        <View style={styles.searchbox}>
          <Text>Film1</Text>
          <Text>Imdb: 9.8</Text>
        </View>
        <View style={styles.searchbox}>
          <Text>Film1</Text>
          <Text>Imdb: 9.8</Text>
        </View>
        <View style={styles.searchbox}>
          <Text>Film1</Text>
          <Text>Imdb: 9.8</Text>
        </View>
        <View style={styles.searchbox}>
          <Text>Film1</Text>
          <Text>Imdb: 9.8</Text>
        </View>
        <View style={styles.searchbox}>
          <Text>Film1</Text>
          <Text>Imdb: 9.8</Text>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#d9d9d9'
  },
  searchbox: {
    borderBottomWidth: 2,
    borderColor: '#d9d9d9',
    height: 50,
    width: "100%"
  }
});


