import { gql } from "@apollo/client";
import { REPO_DETAILS, USER_DETAILS, REVIEW_DETAILS } from "./fragments";

export const GET_REPOSITORIES = gql`
	${REPO_DETAILS}
	query (
		$orderBy: AllRepositoriesOrderBy
		$orderDirection: OrderDirection
		$searchKeyword: String
		$after: String
		$first: Int
	) {
		repositories(
			orderBy: $orderBy
			orderDirection: $orderDirection
			searchKeyword: $searchKeyword
			after: $after
			first: $first
		) {
			pageInfo {
				startCursor
				endCursor
				hasNextPage
			}
			edges {
				node {
					...RepoDetails
				}
				cursor
			}
		}
	}
`;

export const AUTHORIZED_USER = gql`
	${USER_DETAILS}
	${REVIEW_DETAILS}
	query ($includeReviews: Boolean = false, $first: Int, $after: String) {
		authorizedUser {
			...UserDetails
			reviews(first: $first, after: $after) @include(if: $includeReviews) {
				edges {
					cursor
					node {
						...ReviewDetails
					}
				}
				pageInfo {
					startCursor
					endCursor
					hasNextPage
				}
			}
		}
	}
`;

export const GET_REPOSITORY = gql`
	${REPO_DETAILS}
	${USER_DETAILS}
	${REVIEW_DETAILS}
	query ($id: ID!, $first: Int, $after: String) {
		repository(id: $id) {
			...RepoDetails
			url
			reviews(first: $first, after: $after) {
				pageInfo {
					startCursor
					endCursor
					hasNextPage
				}
				edges {
					cursor
					node {
						...ReviewDetails
					}
				}
			}
		}
	}
`;
