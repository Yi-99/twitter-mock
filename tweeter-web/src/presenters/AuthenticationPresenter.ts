import { UserService } from "../model/service/UserService";

export interface AuthenticationView {

}

export abstract class AuthenticationPresenter {
	private _view: AuthenticationView;
	private _service: UserService;

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
}