import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useRegister from '../Hooks/useRegister';
import { useNavigation } from '@react-navigation/native'

const Register = () => {
    const navigation = useNavigation();
    const { loading, error, registerUser } = useRegister();

    const handleRegister = async (values) => {
        const transformedValues = {
            name: values.username,
            email: values.email,
            password: values.password,
            confirmPassword: values.passwordConfirm,
        };

        try {
            await registerUser(transformedValues);
        } catch (error) {
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView style={styles.main}>
                <View style={styles.RegisterContainer}>
                    <Text style={styles.Title}>Hesap Oluştur</Text>
                    <Formik
                        initialValues={{ username: '', email: '', password: '', passwordConfirm: '' }}
                        validationSchema={Yup.object({
                            username: Yup.string().required('Kullanıcı adı gerekli'),
                            email: Yup.string().email('Geçersiz e-posta').required('E-posta gerekli'),
                            password: Yup.string().required('Şifre gerekli'),
                            passwordConfirm: Yup.string()
                                .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
                                .required('Şifre doğrulaması gerekli'),
                        })}
                        onSubmit={handleRegister}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={styles.InputContainer}>
                                <View style={styles.InputBox}>
                                    <TextInput
                                        style={touched.username && errors.username ? styles.ErrorInput : styles.Input}
                                        placeholder="Kullanıcı Adı"
                                        onChangeText={handleChange('username')}
                                        onBlur={handleBlur('username')}
                                        value={values.username}
                                    />
                                    {touched.username && errors.username ? (
                                        <Text style={styles.ErrorText}>{errors.username}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.InputBox}>
                                    <TextInput
                                        placeholder="E-Posta"
                                        style={touched.email && errors.email ? styles.ErrorInput : styles.Input}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email ? (
                                        <Text style={styles.ErrorText}>{errors.email}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.InputBox}>
                                    <TextInput
                                        placeholder="Şifre"
                                        style={touched.password && errors.password ? styles.ErrorInput : styles.Input}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        secureTextEntry
                                    />
                                    {touched.password && errors.password ? (
                                        <Text style={styles.ErrorText}>{errors.password}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.InputBox}>
                                    <TextInput
                                        placeholder="Şifre Doğrulaması"
                                        style={touched.passwordConfirm && errors.passwordConfirm ? styles.ErrorInput : styles.Input}
                                        onChangeText={handleChange('passwordConfirm')}
                                        onBlur={handleBlur('passwordConfirm')}
                                        value={values.passwordConfirm}
                                        secureTextEntry
                                    />
                                    {touched.passwordConfirm && errors.passwordConfirm ? (
                                        <Text style={styles.ErrorText}>{errors.passwordConfirm}</Text>
                                    ) : null}
                                </View>
                                <TouchableOpacity onPress={handleSubmit} style={styles.Button}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{loading ? "Yükleniyor..." : "Hesap Oluştur"}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                    <TouchableOpacity onPress={() => navigation.navigate("login")} style={styles.Button}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{loading ? "Yükleniyor..." : "Giriş Yap"}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        flex: 1,
        backgroundColor: '#B7B597',
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    RegisterContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30
    },
    Title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 20,
        marginBottom: 15,
    },
    InputContainer: {
        alignItems: 'center',
        flex: 1,
    },
    InputBox: {
        position: 'relative'
    },
    Input: {
        borderWidth: 2,
        borderColor: '#d9d9d9',
        width: 275,
        height: 50,
        paddingLeft: 15,
        borderRadius: 7,
        marginTop: 17,
        marginBottom: 17,
    },
    ErrorInput: {
        borderWidth: 2,
        borderColor: '#FF7D7D',
        width: 275,
        height: 50,
        paddingLeft: 15,
        borderRadius: 7,
        marginTop: 17,
        marginBottom: 17,
    },
    Button: {
        width: 275,
        height: 50,
        backgroundColor: '#12CCFF',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 17
    },
    ErrorText: {
        position: 'absolute',
        fontWeight: '500',
        color: '#FF7D7D',
        bottom: -5,
        left: 5
    }
});

export default Register;
