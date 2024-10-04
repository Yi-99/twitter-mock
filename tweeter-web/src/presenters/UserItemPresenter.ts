import { AuthToken, User } from 'tweeter-shared';


export interface UserItemView {
	addItems: (newItems: User[]) => void;
	displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
	private _hasMoreItems: boolean = true;
	private _lastItem: User | null = null;	
	private _view: UserItemView;

	public constructor(view: UserItemView) {
		this._view = view;
	}

	public get view() {
		return this._view
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

	public set lastItem(value: User | null) {
		this._lastItem = value;
	}

	reset() {
		this._lastItem = null;
    this._hasMoreItems = true;
	}

	public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
