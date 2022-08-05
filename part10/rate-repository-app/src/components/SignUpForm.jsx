import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { useHistory } from 'react-router-native';
import * as yup from 'yup';
import { CREATE_USER } from '../graphql/mutations';
import useSignIn from '../hooks/useSignIn';

import theme from '../themes';
import FormikTextInput from './FormikTextInput';
import Text from './Text';

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 20
    },
    button: theme.button,
    buttonText: theme.buttonText
});

const initialValues = {
    username: '',
    password: '',
    passwordConfirmation: ''
};

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .min(1)
        .max(30)
        .required('username is required'),
    password: yup
        .string()
        .min(5)
        .max(50)
        .required('password is required'),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], "passwords don't match")
        .required('password confirmation is required')
});

const SignUpForm = () => {
    const history = useHistory();
    const [signup, ] = useMutation(CREATE_USER);
    const [signin, ] = useSignIn();

    const onSubmit = async ({ username, password }) => {
        await signup({ variables: { username, password }});
        await signin({ username, password });
        history.push('/');
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ handleSubmit }) => 
                <View style={styles.container}>
                    <FormikTextInput
                        name="username"
                        placeholder="Username"
                    />
                    <FormikTextInput
                        name="password"
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                    <FormikTextInput
                        name="passwordConfirmation"
                        placeholder="Password confirmation"
                        secureTextEntry={true}
                    />
                    <Pressable onPress={handleSubmit} style={styles.button}>
                        <Text style={styles.buttonText}>
                            Sign up
                        </Text>
                    </Pressable>
                </View>
            }
        </Formik>
    );
};

export default SignUpForm;