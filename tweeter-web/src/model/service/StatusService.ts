import { AuthToken, FakeData, PagedStatusItemRequest, Status } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
	public async loadMoreFeedItems (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
		const feeds = await this.sf.getMoreFeeds({token: authToken.token, userAlias, pageSize, lastItem} as PagedStatusItemRequest);
		console.log("In loadMoreFeedItems:", feeds);
		return [feeds[0], feeds[1]];
  };

	public async loadMoreStoryItems (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
		return await this.sf.getMoreStories({token: authToken.token, userAlias, pageSize, lastItem} as PagedStatusItemRequest);
  };
}