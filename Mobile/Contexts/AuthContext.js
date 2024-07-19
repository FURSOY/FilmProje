import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [ServerIp, setServerIp] = useState("https://fursoy-server.onrender.com");
    const [authLoading, setAuthLoading] = useState(true);

    const loadAuthData = async () => {
        const userToken = await AsyncStorage.getItem("user_token");
        const storedUserData = await AsyncStorage.getItem("user_data");

        if (userToken) {
            try {
                const response = await axios.get(`${ServerIp}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });

                const newUserData = response.data.user;
                await AsyncStorage.setItem("user_data", JSON.stringify(newUserData));
                setUserData(newUserData);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Kullanıcı verileri alınamadı:", error);
                await logout();
            }
        }

        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
        setAuthLoading(false);
    };

    useEffect(() => {
        loadAuthData();
    }, []);

    const login = async (newToken, newData) => {
        await AsyncStorage.setItem("user_token", newToken);
        await AsyncStorage.setItem("user_data", JSON.stringify(newData));

        setToken(newToken);
        setUserData(newData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem("user_token");
        await AsyncStorage.removeItem("user_data");
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };

    const updateProfileData = async (newData) => {
        await AsyncStorage.setItem("user_data", JSON.stringify(newData));
        setUserData(newData);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated,
                login,
                logout,
                userData,
                updateProfileData,
                ServerIp,
                authLoading,
                loadAuthData
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
