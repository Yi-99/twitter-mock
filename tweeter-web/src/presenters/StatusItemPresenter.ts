import { AuthToken, Status } from "tweeter-shared";

export const PAGE_SIZE = 10;

export interface StatusItemView {
	addItems: (newItems: Status[]) => void;
	displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
	private _hasMoreItems: boolean = true;
	private _lastItem: Status | null = null;
	private _view: StatusItemView;

	public constructor(view: StatusItemView) {
		this._view = view;
	}

	public get view() {
		return this._view;
	}

	public get hasMoreItems() {
		return this._hasMoreItems;
	}

	public get lastItem() {
		return this._lastItem;
	}

	public set view(value: StatusItemView) {
		this._view = value;
	}

	public set hasMoreItems(value: boolean) {
		this._hasMoreItems = value;
	}

	public set lastItem(value: Status | null) {
		this._lastItem = value;
	}

	reset() {
		this._lastItem = null;
		this._hasMoreItems = true;
	}

	public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}