import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (req: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
	const followService = new FollowService();
	const [items, hasMore] = await followService.loadMoreFollowees(req.token,  req.userAlias, req.pageSize, req.lastItem);

	return {
		success: true,
		message: null,
		items: items,
		hasMore: hasMore
	}
}