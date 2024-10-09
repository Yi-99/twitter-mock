import { AuthToken, User } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
	protected getMoreItems(authToken: AuthToken, user: User) {
		return this.service.loadMoreStoryItems(
			authToken,
			user.alias,
			PAGE_SIZE,
			this.lastItem
		);
	}

	protected getItemDescription(): string {
		return 'load story items fetcing';
	}
}