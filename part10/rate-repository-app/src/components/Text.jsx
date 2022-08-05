import React from 'react';
import { StyleSheet, Text } from 'react-native';
import theme from '../themes';

const styles = StyleSheet.create({
    text: {
        ...theme.text,
        fontSize: 16,
        fontWeight: "bold",
        padding: 5
    }
});

const MyText = ({ children, style }) => {
    const textStyles = [
        styles.text,
        style
    ];
    return <Text style={textStyles}>{children}</Text>;
};

export default MyText;
