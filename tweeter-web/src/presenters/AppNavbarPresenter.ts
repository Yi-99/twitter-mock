import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface AppNavbarView extends MessageView {
	clearUserInfo(): void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
	private _service: UserService | null = null;

	public constructor(view: AppNavbarView) {
		super(view);
		this._service = this.userService;
	}

	public get service(): UserService | null {
		return this._service;
	}

	public get userService(): UserService {
		if (this.service === null) return new UserService();
		else return this.service;
	}

	public async logOut(authToken: AuthToken): Promise<void> {
		this.view.displayInfoMessage("Logging Out...", 0);

		this.doFailureReportingOp(async () => {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
		}, 'log user out');
	}
}