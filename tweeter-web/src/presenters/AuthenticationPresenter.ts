import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";
import { PagedItemView } from "./PagedItemPresenter";

export interface AuthenticationView extends View {
	updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
	navigate: (originalUrl: string) => void;
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
	private _service: UserService;
	private _isLoading: boolean = false;

	public constructor(view: AuthenticationView) {
		super(view);
		this._service = new UserService();
	}

	public get service(): UserService {
		return this._service;
	}

	public get isLoading(): boolean {
		return this._isLoading;
	}

	public set isLoading(value: boolean) {
		this._isLoading = value;
	}
}