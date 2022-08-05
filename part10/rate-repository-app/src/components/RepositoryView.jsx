import React from 'react';
import { FlatList } from 'react-native';
import { useMutation } from '@apollo/client';

import useAuthorizedUser from '../hooks/useAuthorizedUser';
import ReviewItem from './ReviewItem';
import { DELETE_REVIEW } from '../graphql/mutations';


const RepositoryView = () => {
    //get reviews on load
    const { authorizedUser, fetchMore, refetch } = useAuthorizedUser(true);

    const reviewNodes = authorizedUser
        ? authorizedUser.reviews.edges.map(edge => edge.node)
        : [];

    const [deleteReview] = useMutation(DELETE_REVIEW);

    const onDelete = async (review) => {
        await deleteReview ({
            variables: {
                id: review.id
            }
        });
        refetch();
    };
    //create reviews list
    return (
        <FlatList
            data={reviewNodes}
            renderItem={({ item }) => 
                <ReviewItem review={item} actionable={true} onDelete={() => onDelete(item)}/>
            }
            onEndReached={fetchMore}
            onEndReachThreshold={0.3}
        />
    );
};

export default RepositoryView;