import useToastListener from "../toaster/ToastListenerHook"
import UserInfoHook from "./UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import { useState } from "react";

interface UserNavigationListener {
  navigateToUser: (event: React.MouseEvent) => Promise<void>
}

const useUserNavigationListener = (): UserNavigationListener => {
  const { displayErrorMessage } = useToastListener();
  const { displayedUser, setDisplayedUser, authToken } =
    UserInfoHook();

	const listener: UserNavigationView = {
		displayErrorMessage: displayErrorMessage,
		setDisplayedUser: setDisplayedUser,
	}

	const [presenter] = useState(new UserNavigationPresenter(listener));

	const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    presenter.navigateToUser(event, authToken!, displayedUser!);
  };

  return {
    navigateToUser: navigateToUser,
  }
}

export default useUserNavigationListener;