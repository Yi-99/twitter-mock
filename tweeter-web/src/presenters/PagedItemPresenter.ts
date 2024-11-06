import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View{
	addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter<PagedItemView<T>> {
	private _hasMoreItems: boolean = true;
	private _lastItem: T | null = null;
	private _service : U;

	public constructor(view: PagedItemView<T>) {
		super(view);
		this._service = this.createService();
	}

	protected abstract createService(): U;

	public get service() {
		return this._service;
	}

	public get hasMoreItems() {
		return this._hasMoreItems;
	}

	public get lastItem() {
		return this._lastItem;
	}

	public set hasMoreItems(value: boolean) {
		this._hasMoreItems = value;
	}

	public set lastItem(value: T | null) {
		this._lastItem = value;
	}

	reset() {
		this._lastItem = null;
		this._hasMoreItems = true;
	}

	public async loadMoreItems(authToken: AuthToken, user: User) {
		this.doFailureReportingOp(async () => {
				const [newItems, hasMore] = await this.getMoreItems(
					authToken,
					user,
				)

				console.log("In PagedItemPresenter:", newItems, hasMore);

				this.hasMoreItems = hasMore;
				this.lastItem = newItems[newItems.length - 1];
				this.view.addItems(newItems);
			}, this.getItemDescription());
  };

	protected abstract getMoreItems(authToken: AuthToken, user: User): Promise<[T[], boolean]>;

	protected abstract getItemDescription(): string;
}