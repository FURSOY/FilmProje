import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../Contexts/AuthContext";

const Header = () => {
    const { isAuthenticated, userData, authLoading } = useAuth();
    const navigation = useNavigation();

    return (
        <View style={styles.Header}>
            <Text style={styles.Logo}>Film Projesi</Text>
            <View style={styles.RightSection}>
                <TouchableOpacity onPress={() => navigation.navigate("search")} style={styles.button}>
                    <FontAwesome name="search" style={{ marginRight: 10 }} size={30} color="black" />
                </TouchableOpacity>

                {authLoading ? (
                    <ActivityIndicator size="small" color="#0000ff" style={{ marginRight: 15 }} />
                ) : (
                    isAuthenticated && userData && userData.avatar ? (
                        <TouchableOpacity onPress={() => navigation.navigate("myprofile")}>
                            <Image source={{ uri: userData.avatar }} style={styles.Avatar} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.LoginButton} onPress={() => navigation.navigate("login")}>
                            <Entypo name="login" size={30} color="black" />
                        </TouchableOpacity>
                    )
                )}
            </View>
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
    Logo: {
        fontSize: 30,
        marginLeft: 20,
        fontWeight: 'bold'
    },
    RightSection: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    LoginButton: {
        padding: 4,
        marginRight: 15,
    },
    Avatar: {
        backgroundColor: 'grey',
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15
    }
});

export default Header;
