import { gql } from '@apollo/client';

export const REPO_DETAILS = gql`
  fragment RepoDetails on Repository {
    id
    fullName
    ownerAvatarUrl
    description
    language
    stargazersCount
    forksCount
    reviewCount
    ratingAverage
  }
`;

export const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    username
  }
`;

export const REVIEW_DETAILS = gql`
  ${USER_DETAILS}
  fragment ReviewDetails on Review {
    id
    text
    rating
    createdAt
    user {
      ...UserDetails
    }
    repositoryId
  }
`;
