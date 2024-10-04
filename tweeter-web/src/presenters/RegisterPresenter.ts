import { UserService } from "../model/service/UserService";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView {
	displayErrorMessage: (message: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter {
	public constructor(view: AuthenticationView) {
		super(view);
	}

	const doRegister = async () => {
    try {
      setIsLoading(true);

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      updateUserInfo(user, user, authToken, rememberMe);
      navigate("/");
    } catch (error) {
      displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      setIsLoading(false);
    }
  };
}