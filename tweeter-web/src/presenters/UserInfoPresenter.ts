import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView } from '../presenters/Presenter';

export interface UserInfoView extends MessageView {
	displayErrorMessage: (message: string) => void;
	displayInfoMessage: (message: string, duration: number) => void;
	clearLastInfoMessage: () => void;
	setIsFollower: (isFollower: boolean) => void;
	setFollowerCount: (followerCount: number) => void;
	setFolloweeCount: (followeeCount: number) => void;
	setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter {
	private _view: UserInfoView;
	private _service: FollowService;

	public constructor(view: UserInfoView) {
		this._view = view;
		this._service = new FollowService();
	}

	public get view(): UserInfoView {
		return this._view;
	}

	public get service(): FollowService {
		return this._service;
	}

	public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

	public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFollowerCount(await this.service.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

	public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

	public async followDisplayedUser (
    event: React.MouseEvent,
		displayedUser: User | null,
		authToken: AuthToken | null
  ): Promise<void> {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  };

  public async unfollowDisplayedUser (
    event: React.MouseEvent,
		displayedUser: User | null,
		authToken: AuthToken | null
  ): Promise<void> {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.service.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  };
}