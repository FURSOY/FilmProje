import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useLogin from '../Hooks/useLogin'; // useLogin hook'u import edildi
import { useNavigation } from '@react-navigation/native'

const Login = () => {
    const navigation = useNavigation();
    const { loading, error, loginUser } = useLogin(); // useLogin hook'u kullanıldı

    const handleLogin = async (values) => {
        try {
            await loginUser(values);
            console.log(values);
        } catch (error) {
            console.error('Error logging in:', error.message);
            Alert.alert('Hata', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView style={styles.main}>
                <View style={styles.loginContainer}>
                    <Text style={styles.title}>Giriş Yap</Text>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={Yup.object({
                            email: Yup.string().email('Geçersiz e-posta').required('E-posta gerekli'),
                            password: Yup.string().required('Şifre gerekli'),
                        })}
                        onSubmit={handleLogin}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={styles.inputContainer}>
                                <View style={styles.inputBox}>
                                    <TextInput
                                        placeholder="E-Posta"
                                        style={touched.email && errors.email ? styles.errorInput : styles.input}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email ? (
                                        <Text style={styles.errorText}>{errors.email}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.inputBox}>
                                    <TextInput
                                        placeholder="Şifre"
                                        style={touched.password && errors.password ? styles.errorInput : styles.input}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        secureTextEntry
                                    />
                                    {touched.password && errors.password ? (
                                        <Text style={styles.errorText}>{errors.password}</Text>
                                    ) : null}
                                </View>
                                {error && <Text style={styles.errorText}>{error}</Text>}
                                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{loading ? "Yükleniyor..." : "Giriş Yap"}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                    <TouchableOpacity onPress={() => navigation.navigate("register")} style={styles.button}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Hesap Oluştur</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B7B597',
    },
    main: {
        flex: 1,
        paddingVertical: 30
    },
    loginContainer: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 20,
        marginBottom: 15,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    inputBox: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        borderWidth: 2,
        borderColor: '#d9d9d9',
        width: '100%',
        height: 50,
        paddingLeft: 15,
        borderRadius: 7,
    },
    errorInput: {
        borderWidth: 2,
        borderColor: '#FF7D7D',
        width: '100%',
        height: 50,
        paddingLeft: 15,
        borderRadius: 7,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#12CCFF',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    errorText: {
        color: '#FF7D7D',
        marginTop: 5,
    },
});

export default Login;
