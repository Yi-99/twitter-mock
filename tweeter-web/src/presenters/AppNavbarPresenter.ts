import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface AppNavbarView extends MessageView {
	clearUserInfo(): void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
	private _service: UserService;

	public constructor(view: AppNavbarView) {
		super(view);
		this._service = new UserService();
	}

	public get service(): UserService {
		return this._service;
	}

	public logOut(authToken: AuthToken): void {
		this.view.displayInfoMessage("Logging Out...", 0);

		this.doFailureReportingOp(async () => {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
		}, 'log user out');
	}
}