import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'

const SearchHeader = () => {

    const navigation = useNavigation();

    return (
        <View style={styles.Header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbutton}>
                <FontAwesome name="arrow-left" size={30} color="black" />
            </TouchableOpacity>
            <TextInput style={styles.SearchInput} />
            <TouchableOpacity onPress={() => navigation.navigate("search")} style={styles.button}>
                <FontAwesome name="search" style={{ marginRight: 10 }} size={30} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    Header: {
        height: 70,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    SearchInput: {
        width: 300,
        height: 40,
        borderWidth: 2,
        borderColor: '#d9d9d9',
        borderRadius: 5
    },
    backbutton: {
        marginLeft: 10
    }
});

export default SearchHeader;
