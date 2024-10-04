import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView {

}

export class LoginPresenter extends AuthenticationPresenter {
	public constructor(view: AuthenticationView) {
		super(view);
	}

	public async doLogin(alias: string, password: string) {
    try {
      setIsLoading(true);

      const [user, authToken] = await this.service.login(alias, password);

      updateUserInfo(user, user, authToken, rememberMe);

      if (!!props.originalUrl) {
        navigate(props.originalUrl);
      } else {
        navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      setIsLoading(false);
    }
  };
}