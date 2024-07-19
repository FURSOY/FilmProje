import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Screens/Home";
import WatchedList from "./Screens/WatchedList";
import Register from "./Screens/Register";
import Myprofile from "./Screens/Myprofile";
import EditProfile from "./Screens/EditProfile";
import Login from "./Screens/Login";
import WatchList from "./Screens/WatchList";
import Search from "./Screens/Search";
import { useAuth } from "./Contexts/AuthContext";

const Stack = createNativeStackNavigator();

const Navigator = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Stack.Navigator>
            <Stack.Screen name="home" component={Home} options={{
                headerShown: false,
                animation: 'slide_from_bottom'
            }} />
            {!isAuthenticated && (
                <Stack.Screen name="register" component={Register} options={{
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }} />
            )}
            {!isAuthenticated && (
                <Stack.Screen name="login" component={Login} options={{
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }} />
            )}
            {isAuthenticated && (
                <Stack.Screen name="myprofile" component={Myprofile} options={{
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }} />
            )}
            {isAuthenticated && (
                <Stack.Screen name="editprofile" component={EditProfile} options={{
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }} />
            )}
            <Stack.Screen name="watchedlist" component={WatchedList} options={{
                headerShown: false,
                animation: 'slide_from_left'
            }} />
            <Stack.Screen name="watchlist" component={WatchList} options={{
                headerShown: false,
                animation: 'slide_from_right'
            }} />
            <Stack.Screen name="search" component={Search} options={{
                headerShown: false,
                animation: 'default'
            }} />
        </Stack.Navigator>
    );
};

export default Navigator;
