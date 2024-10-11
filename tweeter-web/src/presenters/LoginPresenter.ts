import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {
}

export class LoginPresenter extends AuthenticationPresenter {
	public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string) {
    this.doFailureReportingOp(async () => {
      this.isLoading = true;

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

			this.view.navigate(originalUrl);
		}, 'log user in');
		this.isLoading = false;
  };
}
