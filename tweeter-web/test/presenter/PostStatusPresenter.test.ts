import { PostStatusView, PostStatusPresenter } from "../../src/presenters/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { instance, mock, spy, verify, when, capture, anything } from "ts-mockito";
import { PostStatusService } from "../../src/model/service/PostStatusService";

describe("PostStatusPresenter", () => {
	let mockPostStatusView: PostStatusView;
	let postStatusPresenter: PostStatusPresenter;
	let mockPostStatusService: PostStatusService;
	const mouseEvent = mock<React.MouseEvent>();
	const currentUser = mock<User>();
	const authToken = new AuthToken('abc123', Date.now());

	beforeEach(() => {
		mockPostStatusView = mock<PostStatusView>();
		const mockPostStatusViewInstance = instance(mockPostStatusView);

		const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
		postStatusPresenter = instance(postStatusPresenterSpy);

		mockPostStatusService = mock<PostStatusService>();
		const mockPostStatusServiceInstance = instance(mockPostStatusService);

		when(postStatusPresenterSpy.service).thenReturn(mockPostStatusServiceInstance);
	})

	it("display a posting status message", async () => {
		await postStatusPresenter.submitPost(mouseEvent, "Hello, World!", currentUser, authToken);

		verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
	})

	it("calls post status from post status service with correct status and auth token", async () => {
		await postStatusPresenter.submitPost(mouseEvent, "Hello, World!", currentUser, authToken);

		verify(mockPostStatusService.postStatus(authToken, anything())).once();
	})

	it("when posting a status is successful, clear last info message and post and display the status posted message", async () => {
		await postStatusPresenter.submitPost(mouseEvent, "Hello, World!", currentUser, authToken);

		verify(mockPostStatusView.clearLastInfoMessage()).once();
		verify(mockPostStatusView.setPost("")).once();
		verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
	})

	it("when posting a status fails, display error message and clear last info message and does not clear the post or display status posted message", async () => {
		const error = new Error("An error has occurred");
		when(mockPostStatusService.postStatus(authToken, anything())).thenThrow(error);

		await postStatusPresenter.submitPost(mouseEvent, "Hello, World!", currentUser, authToken);

		verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error has occurred")).once();

		verify(mockPostStatusView.clearLastInfoMessage()).once();
		verify(mockPostStatusView.setPost("")).never();
	})
});