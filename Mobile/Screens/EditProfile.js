import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from "../Contexts/AuthContext";
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import useUpdateProfileData from "../Hooks/useUpdateProfileData";
import * as ImagePicker from 'expo-image-picker';

const Editprofile = () => {
    const navigation = useNavigation();
    const { isAuthenticated, userData, authLoading } = useAuth();
    const { changeProfileData, loading, error } = useUpdateProfileData();

    const pickImage = async (setFieldValue) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.1,
            base64: true
        });

        if (!result.canceled && result.assets.length > 0) {
            const base64Image = 'data:image/jpeg;base64,' + result.assets[0].base64;
            setFieldValue('avatar', base64Image);
        }
    };

    if (authLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header />
                <View style={styles.main}>
                    <View style={styles.Box}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Yükleniyor...</Text>
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
                    <Formik
                        initialValues={{
                            name: userData.name,
                            email: userData.email,
                            role: userData.role,
                            avatar: userData.avatar,
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Kullanıcı adı gerekli'),
                            email: Yup.string().email('Geçersiz e-posta').required('E-posta gerekli'),
                            role: Yup.string().required('Rol gerekli'),
                            avatar: Yup.string().required('Avatar gerekli')
                        })}
                        onSubmit={async (values) => {
                            try {
                                await changeProfileData(values);
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                            <View style={styles.Box}>
                                <View style={styles.InputBox}>
                                    <TouchableOpacity onPress={() => pickImage(setFieldValue)}>
                                        <Image style={styles.Avatar} source={{ uri: values.avatar }} />
                                    </TouchableOpacity>
                                    {touched.avatar && errors.avatar && (
                                        <Text style={styles.ErrorText}>{errors.avatar}</Text>
                                    )}
                                </View>
                                <View style={styles.InputBox}>
                                    <TextInput
                                        style={touched.name && errors.name ? styles.ErrorInput : styles.Input}
                                        placeholder="Kullanıcı Adı"
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                    />
                                    {touched.name && errors.name && (
                                        <Text style={styles.ErrorText}>{errors.name}</Text>
                                    )}
                                </View>
                                <View style={styles.InputBox}>
                                    <TextInput
                                        style={touched.email && errors.email ? styles.ErrorInput : styles.Input}
                                        placeholder="E-posta"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={styles.ErrorText}>{errors.email}</Text>
                                    )}
                                </View>
                                <View style={styles.InputBox}>
                                    <Picker
                                        selectedValue={values.role}
                                        style={styles.Picker}
                                        onValueChange={(itemValue) => setFieldValue('role', itemValue)}
                                    >
                                        <Picker.Item label="Kullanıcı" value="user" />
                                        <Picker.Item label="Admin" value="admin" />
                                        <Picker.Item label="Moderatör" value="moderator" />
                                    </Picker>
                                    {touched.role && errors.role && (
                                        <Text style={styles.ErrorText}>{errors.role}</Text>
                                    )}
                                </View>
                                <TouchableOpacity onPress={handleSubmit} style={styles.Button}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Kaydet</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                ) : (
                    <Text>Giriş yapınız</Text>
                )}
            </View>
            <Footer />
        </SafeAreaView >
    );
};

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
        height: 460,
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    InputBox: {
        marginBottom: 20,
        width: '100%',
    },
    Input: {
        borderWidth: 2,
        borderColor: '#d9d9d9',
        width: '100%',
        height: 50,
        paddingLeft: 15,
        borderRadius: 7,
    },
    ErrorInput: {
        borderWidth: 2,
        borderColor: '#FF7D7D',
        width: '100%',
        height: 50,
        paddingLeft: 15,
        borderRadius: 7,
    },
    ErrorText: {
        color: '#FF7D7D',
        marginTop: 5,
    },
    Button: {
        width: '100%',
        height: 50,
        backgroundColor: '#12CCFF',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Picker: {
        height: 50,
        width: '100%',
        borderWidth: 2,
        borderColor: '#d9d9d9',
        borderRadius: 7,
    },
    Avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10
    },
});

export default Editprofile;