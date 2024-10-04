import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { AuthToken, FakeData, Status } from "tweeter-shared";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import UserInfoHook from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from './presenters/FolloweePresenter';
import { FollowerPresenter } from './presenters/FollowerPresenter';
import { UserItemView } from "./presenters/UserItemPresenter";
import { AuthenticationView } from "./presenters/AuthenticationPresenter";
import { LoginPresenter } from "./presenters/LoginPresenter";
import { RegisterPresenter } from "./presenters/RegisterPresenter";
import StoryScroller from "./components/mainLayout/StoryScroller";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import FeedScroller from "./components/mainLayout/FeedScroller";

const App = () => {
  const { currentUser, authToken } = UserInfoHook();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const loadMoreStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route 
          path="feed" 
          element={
            <FeedScroller 
              key={1} 
              presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
            />
          } 
        />
        <Route 
          path="story" 
          element={
            <StoryScroller 
              key={2} 
              presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
            />
          } 
        />
        <Route
          path="followees"
          element={
            <UserItemScroller
              key={1}
							presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              key={2} 
              presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login presenterGenerator={(view: AuthenticationView) => new LoginPresenter(view)} />} />
      <Route path="/register" element={<Register presenterGenerator={(view: AuthenticationView) => new RegisterPresenter(view)} />} />
      <Route path="*" element={<Login presenterGenerator={(view: AuthenticationView) => new LoginPresenter(view)} />} />
    </Routes>
  );
};

export default App;
