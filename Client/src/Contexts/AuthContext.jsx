import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(Cookies.get("user_token") || null);
    const [userData, setUserData] = useState(localStorage.getItem("user_data") ? JSON.parse(localStorage.getItem("user_data")) : null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("user_token"));
    const [ServerIp, setServerIp] = useState("http://localhost:3000");
    const [authLoading, setAuthLoading] = useState(true);
    // https://ana-server.onrender.com // http://localhost:3000

    useEffect(() => {
        const userToken = Cookies.get("user_token");

        if (userToken) {
            axios.get(`${ServerIp}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
                .then(response => {
                    const newUserData = response.data.user;
                    localStorage.setItem("user_data", JSON.stringify(newUserData));
                    setUserData(newUserData);
                    setIsAuthenticated(true);
                    setAuthLoading(false); // Data successfully loaded
                })
                .catch(error => {
                    console.error("Kullanıcı verileri alınamadı:", error);
                    logout();
                    setAuthLoading(false); // Data load failed
                });
        } else {
            setAuthLoading(false); // No user token, loading finished
        }
    }, [ServerIp]);

    const login = (newToken, newData) => {
        // Cookie'yi HttpOnly ve Secure olarak ayarlayarak kaydet
        Cookies.set("user_token", newToken, { secure: true, sameSite: 'strict' });

        localStorage.setItem("user_data", JSON.stringify(newData));

        setToken(newToken);
        setUserData(newData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        Cookies.remove("user_token");
        localStorage.removeItem("user_data");
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };

    const updateProfileData = (newData) => {
        localStorage.setItem("user_data", JSON.stringify(newData));
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
                authLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
