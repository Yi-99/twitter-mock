import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
	public async loadMoreFollowers (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
		const [users, hasMore] = await this.sf.getMoreFollowers({token: authToken.token, userAlias, pageSize, lastItem: lastItem!.dto});
		users.forEach((user) => user);
		return [users, hasMore];
		// return this.getFakeData(lastItem, pageSize, userAlias);
  };

  public async loadMoreFollowees (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
		const [users, hasMore] = await this.sf.getMoreFollowees({token: authToken.token, userAlias, pageSize, lastItem: lastItem!.dto});
		users.forEach((user) => user);
		return [users, hasMore];
		// return this.getFakeData(lastItem, pageSize, userAlias);
  };

	public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
		return await this.sf.unfollow({authToken: authToken.dto, userToUnfollow: userToUnfollow.dto});
    // // Pause so we can see the unfollow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // // TODO: Call the server

    // const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
    // const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

    // return [followerCount, followeeCount];
  };

	public async follow (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // // Pause so we can see the follow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // // TODO: Call the server

    // const followerCount = await this.getFollowerCount(authToken, userToFollow);
    // const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    // return [followerCount, followeeCount];
		return await this.sf.follow({authToken: authToken.dto, userToFollow: userToFollow.dto});
  };

	public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
		return await this.sf.getIsFollowerStatus({authToken: authToken.dto, user: user.dto, selectedUser: selectedUser.dto});
    // return FakeData.instance.isFollower();
  };

	public async getFolloweeCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
		return await this.sf.getFolloweesCount({authToken: authToken.dto, user: user.dto});
		// return FakeData.instance.getFolloweeCount(user.alias);
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
		return await this.sf.getFollowersCount({authToken: authToken.dto, user: user.dto});
		// return FakeData.instance.getFollowerCount(user.alias);
  };
}