import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (req: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
	const statusService = new StatusService();
	const [items, hasMore] = await statusService.loadMoreStoryItems(req.token, req.userAlias, req.pageSize, req.lastItem);

	return {
		success: true,
		message: null,
		items: items,
		hasMore: hasMore
	}
}