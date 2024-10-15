import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusService } from "../model/service/PostStatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
	setIsLoading: (isLoading: boolean) => void;
	setPost: (post: string) => void;
	displayErrorMessage: (message: string) => void;
	displayInfoMessage: (message: string, duration: number) => void;
	clearLastInfoMessage: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView>{
	private _service: PostStatusService;

	public constructor(view: PostStatusView) {
		super(view);
		this._service = new PostStatusService();
	}

	public get view(): PostStatusView {
		return this._view;
	}

	public get service(): PostStatusService {
		return this._service;
	}

	public async submitPost (event: React.MouseEvent, newPost: string, currentUser: User | null, authToken: AuthToken | null) {
    event.preventDefault();

		this.doFailureReportingOp(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(newPost, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
		}, 'post the status');
		this.view.clearLastInfoMessage();
		this.view.setIsLoading(false);
  };

	public clearPost (event: React.MouseEvent) {
		event.preventDefault();
		this.view.setPost("");
	}
}