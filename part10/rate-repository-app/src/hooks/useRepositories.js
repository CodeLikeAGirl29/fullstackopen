import { useQuery } from "@apollo/client";

import { GET_REPOSITORIES } from "../graphql/queries";

const useRepositories = ({ orderBy, searchKeyword, first }) => {
	let variables;
	switch (orderBy) {
		case "latest": {
			variables = { orderBy: "CREATED_AT", searchKeyword, first };
			break;
		}
		case "highestRated": {
			variables = {
				orderBy: "RATING_AVERAGE",
				orderDirection: "DESC",
				searchKeyword,
				first,
			};
			break;
		}
		case "lowestRated": {
			variables = {
				orderBy: "RATING_AVERAGE",
				orderDirection: "ASC",
				searchKeyword,
				first,
			};
			break;
		}
		default:
			variables = { searchKeyword, first };
	}

	const { data, loading, fetchMore } = useQuery(GET_REPOSITORIES, {
		fetchPolicy: "cache-and-network",
		variables,
	});

	const handleFetchMore = () => {
		const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;
		if (!canFetchMore) {
			return;
		}
		fetchMore({
			variables: {
				...variables,
				after: data.repositories.pageInfo.endCursor,
			},
		});
	};

	return {
		repositories: data?.repositories,
		loading,
		fetchMore: handleFetchMore,
	};
};

export default useRepositories;
