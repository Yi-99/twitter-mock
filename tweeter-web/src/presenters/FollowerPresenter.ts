import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export interface FollowerView {

}

export class FollowerPresenter extends UserItemPresenter {
  private followService: FollowService;

  public constructor(view: UserItemView) {  
		super(view);
    this.followService = new FollowService();
  }

	public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
			const [newItems, hasMore] = await this.followService.loadMoreFollowers(
				authToken,
				userAlias,
				PAGE_SIZE,
				this.lastItem
			)

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load followers fetching because of exception: ${error}`
      );
    }
  };
}