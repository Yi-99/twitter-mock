import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationField from "../AuthenticationField";
import UserInfoHook from "../../userInfo/UserInfoHook";
import { AuthenticationView } from "../../../presenters/AuthenticationPresenter";
import useToastListener from "../../toaster/ToastListenerHook";
import { LoginPresenter } from "../../../presenters/LoginPresenter";

interface Props {
	presenter?: LoginPresenter;
	presenterGenerator: (view: AuthenticationView) => LoginPresenter;
	originalUrl: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
  const { displayErrorMessage } = useToastListener();

	const navigate = useNavigate();
  const { updateUserInfo } = UserInfoHook();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

	const listener: AuthenticationView = {
		updateUserInfo: updateUserInfo,
		navigate: navigate,
		displayErrorMessage: displayErrorMessage
	}

	const [presenter] = useState(props.presenter ?? new LoginPresenter(listener));

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenter.doLogin(alias, password, rememberMe, props.originalUrl);
    }
  };

	const doLogin = async () => {
		await presenter.doLogin(alias, password, rememberMe, props.originalUrl);
	}

	const inputFieldGenerator = () => {
    return (
      <AuthenticationField
        setAlias={setAlias}
        setPassword={setPassword}
				onEnter={loginOnEnter}
      />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={presenter.isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
