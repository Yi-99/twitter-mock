import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
	public async loadMoreFollowers (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
		if (lastItem != null) {
			const [users, hasMore] = await this.sf.getMoreFollowers({token: authToken.token, userAlias, pageSize, lastItem: lastItem.dto});
			users.forEach((user) => user);
			return [users, hasMore];
		} else {
			const [users, hasMore] = await this.sf.getMoreFollowers({token: authToken.token, userAlias, pageSize, lastItem: null});
			users.forEach((user) => user);
			return [users, hasMore];
		}
  };

  public async loadMoreFollowees (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
		if (lastItem != null) {
			const [users, hasMore] = await this.sf.getMoreFollowees({token: authToken.token, userAlias, pageSize, lastItem: lastItem.dto});
			users.forEach((user) => user);
			return [users, hasMore];
		} else {
			const [users, hasMore] = await this.sf.getMoreFollowees({token: authToken.token, userAlias, pageSize, lastItem: null});
			users.forEach((user) => user);
			return [users, hasMore];
		}
  };

	public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
		return await this.sf.unfollow({authToken: authToken.dto, userToUnfollow: userToUnfollow.dto});
  };

	public async follow (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
		return await this.sf.follow({authToken: authToken.dto, userToFollow: userToFollow.dto});
  };

	public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
		return await this.sf.getIsFollowerStatus({authToken: authToken.dto, user: user.dto, selectedUser: selectedUser.dto});
  };

	public async getFolloweeCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
		return await this.sf.getFolloweesCount({authToken: authToken.dto, user: user.dto});
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
		return await this.sf.getFollowersCount({authToken: authToken.dto, user: user.dto});
  };
}