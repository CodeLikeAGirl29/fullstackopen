import { Formik } from 'formik';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';

import FormikTextInput from './FormikTextInput';
import Text from './Text';
import theme from '../themes';
import { CREATE_REVIEW } from '../graphql/mutations';
import { useHistory } from 'react-router-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 20
    },
    button: theme.button,
    buttonText: theme.buttonText
});

const initialValues = {
    ownerName: '',
    repositoryName: '',
    rating: 100,
    text: ''
};

const validationSchema = yup.object().shape({
    ownerName: yup
        .string()
        .required('repository owner name is required'),
    repositoryName: yup
        .string()
        .required('repository name is required'),
    rating: yup
        .number()
        .min(0)
        .max(100)
        .required('rating is required'),
    text: yup
        .string()
});

const RepositoryForm = () => {
    const [createReview,] = useMutation(CREATE_REVIEW);
    const history = useHistory();

    const onSubmit = async ({ repositoryName, ownerName, rating, text }) => {
        const { data }  = await createReview({ variables: {
            repositoryName,
            ownerName,
            rating: Number(rating),
            text
        } });
        history.push(`/repositories/${data.createReview.repositoryId}`);
    };
    
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
        {({ handleSubmit }) => 
            <View style={styles.container}>
                <FormikTextInput
                    name="ownerName"
                    placeholder="Repository owner name"
                />
                <FormikTextInput
                    name="repositoryName"
                    placeholder="Repository name"
                />
                <FormikTextInput
                    name="rating"
                    placeholder="Rating between 0 and 100"
                    type="number"
                />
                <FormikTextInput
                    name="text"
                    placeholder="Review"
                    multiline={true}
                />
                <Pressable style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Create a review</Text>
                </Pressable>
            </View>
        }
        </Formik>
    );
};

export default RepositoryForm;