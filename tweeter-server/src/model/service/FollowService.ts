import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { DaoFactory } from "../daos/DaoFactory";
import { FollowDao } from "../daos/FollowDao";

export class FollowService {
	private dao: FollowDao;

	constructor() {
		this.dao = DaoFactory.getDao('follow');
	}

	public async loadMoreFollowers (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
		return this.getFakeData(lastItem, pageSize, userAlias);
  };

  public async loadMoreFollowees (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
		return this.getFakeData(lastItem, pageSize, userAlias);
  };

	public async unfollow (
    authToken: AuthTokenDto,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

		const token = AuthToken.fromDto(authToken);
		const user = User.fromDto(userToUnfollow);

		if (token !== null && user !== null) {
			const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
			const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
			return [followerCount, followeeCount];
		}

		return [0, 0];
  };

	public async follow (
    authToken: AuthTokenDto,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
		const token = AuthToken.fromDto(authToken);
		const user = User.fromDto(userToFollow);

		if (token !== null && user !== null) {
			const followerCount = await this.getFollowerCount(authToken, userToFollow);
			const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
			return [followerCount, followeeCount];
		}

		return [0, 0];
  };

	public async getIsFollowerStatus (
    authToken: AuthTokenDto,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

	public async getFolloweeCount (
    authToken: AuthTokenDto,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user._alias);
  };

  public async getFollowerCount (
    authToken: AuthTokenDto,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user._alias);
  };

  private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((followee) => followee.dto);
    return [dtos, hasMore];
  }
}