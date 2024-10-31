import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView extends View {
	setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
	private _service: UserService;
	
	public constructor(view: UserNavigationView) {
		super(view);
		this._service = new UserService();
	}

	public get service() {
		return this._service;
	}

	public extractAlias(value: string): string {
		const index = value.indexOf("@");
		return value.substring(index);
	}

	public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User): Promise<void> {
    event.preventDefault();

		this.doFailureReportingOp(async () => {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
		}, 'get user')
	};
}