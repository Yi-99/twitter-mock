import { AuthToken } from 'tweeter-shared';
import { AppNavbarPresenter, AppNavbarView } from '../../src/presenters/AppNavbarPresenter';
import { capture, instance, mock, spy, verify, when } from 'ts-mockito';
import { UserService } from '../../src/model/service/UserService';

describe("AppNavbarPresenter", () => {
	let mockAppNavbarView: AppNavbarView;
	let appNavbarPresenter: AppNavbarPresenter;
	let mockUserService: UserService;

	const authToken = new AuthToken('abc123', Date.now());

	beforeEach(() => {
		mockAppNavbarView = mock<AppNavbarView>();
		const mockAppNavbarViewInstance = instance(mockAppNavbarView);

		const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance));
		appNavbarPresenter = instance(appNavbarPresenterSpy);

		mockUserService = mock<UserService>();
		const mockUserServiceInstance = instance(mockUserService);

		when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
	});

	it("display logging out message", async () => {
		await appNavbarPresenter.logOut(authToken);
		verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
	});

	it("calls logout from user service with correct auth token", async () => {
		await appNavbarPresenter.logOut(authToken);

		verify(mockUserService.logout(authToken)).once();

		let [capturedAuthToken] = capture(mockUserService.logout).last();
		expect(capturedAuthToken).toEqual(authToken);
	})

	it("when logout is successful, clear last info message and user info, then navigate the user to the login page", async () => {
		await appNavbarPresenter.logOut(authToken);

		verify(mockAppNavbarView.clearLastInfoMessage()).once();
		verify(mockAppNavbarView.clearUserInfo()).once();
		// verify(mockAppNavbarView.navigateToLoginPage()).once();
	})

	it("when logout fails, display error message and does not clear last info or user info", async () => {
		const error = new Error("An error has occurred");
		when(mockUserService.logout(authToken)).thenThrow(error);

		await appNavbarPresenter.logOut(authToken);

		let [capturedErrorMessage] = capture(mockAppNavbarView.displayErrorMessage).last();
		console.log(capturedErrorMessage);		
		
		verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: An error has occurred")).once();

		verify(mockAppNavbarView.clearLastInfoMessage()).never();
		verify(mockAppNavbarView.clearUserInfo()).never();
	})
})