import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {
}

export class LoginPresenter extends AuthenticationPresenter {
	public constructor(view: LoginView) {
		super(view);
	}

	public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  };
}
