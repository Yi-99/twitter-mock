import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationField from "../AuthenticationField";
import UserInfoHook from "../../userInfo/UserInfoHook";
import { AuthenticationPresenter, AuthenticationView } from "../../../presenters/AuthenticationPresenter";

interface Props {
	presenterGenerator: (view: AuthenticationView) => AuthenticationPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
  const { updateUserInfo } = UserInfoHook();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

	const listener: AuthenticationView = {
		
	}

	const [presenter] = useState(props.presenterGenerator(listener));

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenter.doLogin(alias, password);
    }
  };

	const inputFieldGenerator = () => {
    return (
      <AuthenticationField
        setAlias={setAlias}
        setPassword={setPassword} 
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
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
