import { useQuery } from "@apollo/client";

import { AUTHORIZED_USER } from "../graphql/queries";

const useAuthorizedUser = (includeReviews = false) => {
	let variables = {};
	if (includeReviews) {
		variables = {
			includeReviews,
			first: 3,
		};
	}
	const { data, loading, fetchMore, refetch } = useQuery(AUTHORIZED_USER, {
		variables,
	});

	const handleFetchMore = () => {
		const canFetchMore =
			!loading && data?.authorizedUser.reviews.pageInfo.hasNextPage;
		if (!canFetchMore) {
			return;
		}
		return fetchMore({
			variables: {
				...variables,
				after: data.authorizedUser.reviews.pageInfo.endCursor,
			},
		});
	};

	return {
		authorizedUser: data?.authorizedUser,
		loading,
		fetchMore: handleFetchMore,
		refetch,
	};
};

export default useAuthorizedUser;
