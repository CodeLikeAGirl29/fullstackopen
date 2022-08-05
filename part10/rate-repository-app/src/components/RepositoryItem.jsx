import React from 'react';
import { Pressable, StyleSheet, View, Alert } from 'react-native';
import { Link } from 'react-router-native';

import Text from './Text';
import theme from '../themes';

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "white",
        marginBottom: 10
    },
    reviewContainer: {
        flexDirection: "row"
    },
    reviewDate: {
        ...theme.meta
    },
    reviewText: {
        fontWeight:"normal"
    },
    reviewRatingContainer: {
        width: 50,
        height: 50,
        borderRadius:25,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        marginRight: 10
    },
    reviewRating: {
        color: theme.colors.primary
    },
    button: {
        ...theme.button,
        flexGrow: 1,
        margin: 10
    },
    warningButton: {
        backgroundColor: theme.colors.error
    },
    buttonText: theme.buttonText,
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
});

const RepositoryItem = ({ review, onDelete, actionable=false }) => {
    const date = (new Date(review.createdAt)).toLocaleDateString();
    const onDeletePressed = () => {
        Alert.alert(
            'Delete review',
            'Are you sure you want to delete this review?',
            [{
                text: 'CANCEL',
                style: 'cancel'
            },{
                text: 'DELETE',
                onPress: onDelete,
            }]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.reviewContainer}>
                <View style={styles.reviewRatingContainer}>
                    <Text style={styles.reviewRating}>{review.rating}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text>{review.user.username}</Text>
                    <Text style={styles.reviewDate}>{date}</Text>
                    <Text style={styles.reviewText}>{review.text}</Text>
                </View>
            </View>
            {actionable && <View style={styles.buttonContainer}>
                <Link style={styles.button} to={`/repositories/${review.repositoryId}`}>
                    <Text style={styles.buttonText}>
                        View repository
                    </Text>
                </Link>
                <Pressable style={[styles.button, styles.warningButton]} onPress={onDeletePressed}>
                    <Text style={styles.buttonText}>
                        Delete review
                    </Text>
                </Pressable>
            </View>}
        </View>
    );
};

export default RepositoryItem;