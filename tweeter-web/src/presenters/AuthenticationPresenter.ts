import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AuthenticationView {
	updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
	displayErrorMessage: (message: string) => void;
	navigate: (originalUrl: string) => void;
}

export abstract class AuthenticationPresenter {
	private _view: AuthenticationView;
	private _service: UserService;
	private _isLoading: boolean = false;

	public constructor(view: AuthenticationView) {
		this._view = view;
		this._service = new UserService();
	}

	public get view() {
		return this._view;
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