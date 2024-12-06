import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { DaoFactory } from "../daos/DaoFactory";
import { FollowDao } from "../daos/FollowDao";
import { SessionDao } from "../daos/SessionDao";
import { UserDao } from "../daos/UserDao";

export class FollowService {
	private dao: FollowDao;
	private sessionDao: SessionDao;
	private userDao: UserDao;
	
	constructor() {
		this.dao = DaoFactory.getDao('follow');
		this.sessionDao = DaoFactory.getDao('session');
		this.userDao = DaoFactory.getDao('user');
	}

	async validateSession(token: string) {
		const session = await this.sessionDao.getSession(token);

		if (!session) {
			throw new Error("Invalid auth token!");
		}

		const now = Math.floor(Date.now() / 1000);
		console.log("now:", now);
		console.log("session timestamp:", session.timestamp);
		if (now > session.timestamp) {
			throw new Error("Auth token expired!");
		}

		await this.sessionDao.updateSession(token, now + 3600);

		return session;
	}

	public async loadMoreFollowers (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
		await this.validateSession(authToken);
		const response = await this.dao.loadFollowers(lastItem?._alias, pageSize, userAlias);
		if (response.items.length === 0) {
			return [[], false];
		}
		const users: UserDto[] = response.items.map((item: any) => {
			const nameParts = item.followee_name.S.split(" ");
			const firstName = nameParts[0] || "";
			const lastName = nameParts.slice(1).join(" ") || "";
			return {
				_alias: item.followee_handle.S,
				_firstName: firstName,
				_lastName: lastName,
				_imageUrl: item.followeeUrl.S,
			}
		});

		return [users, response.hasNextPage];
  };

  public async loadMoreFollowees (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
		await this.validateSession(authToken);
    const response = await this.dao.loadFollowees(lastItem?._alias, pageSize, userAlias);
		if (response.items.length === 0) {
			return [[], false];
		}
    const users: UserDto[] = response.items.map((item: any) => {
			const nameParts = item.follower_name.S.split(" ");
			const firstName = nameParts[0] || "";
			const lastName = nameParts.slice(1).join(" ") || "";
      return {
        _alias: item.follower_handle.S,
        _firstName: firstName,
        _lastName: lastName,
        _imageUrl: item.followerUrl.S,
      };
    });

    return [users, response.hasNextPage]
  };

	public async unfollow (
    authToken: AuthTokenDto,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
		const session = await this.validateSession(AuthToken.fromDto(authToken)!.token);

		const user = await this.userDao.updateCount(session.alias, 'followingCount', -1);
		await this.userDao.updateCount(userToUnfollow._alias, 'followerCount', -1);

		await this.dao.unfollow(session.alias, User.fromDto(userToUnfollow)!);

		const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
		const followingCount = await this.getFolloweeCount(authToken, userToUnfollow);
		console.log("followerCount:", followerCount);
		console.log("followingCount:", followingCount);
		console.log("user count:", user?.followerCount, user?.followingCount);
		return [followerCount, followingCount];
  };

	public async follow (
    authToken: AuthTokenDto,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
		const session = await this.validateSession(AuthToken.fromDto(authToken)!.token);

		const user = await this.userDao.updateCount(session.alias, 'followingCount', 1);
		await this.userDao.updateCount(userToFollow._alias, 'followerCount', 1);

		await this.dao.follow(session.alias, User.fromDto(userToFollow)!);

		const followerCount = await this.getFollowerCount(authToken, userToFollow);
		const followingCount = await this.getFolloweeCount(authToken, userToFollow);
		console.log("followerCount:", followerCount);
		console.log("followingCount:", followingCount);
		console.log("user count:", user?.followerCount, user?.followingCount);
		return [followerCount, followingCount];
  };

	public async getIsFollowerStatus (
    authToken: AuthTokenDto,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
		await this.validateSession(AuthToken.fromDto(authToken)!.token);

		const response = await this.dao.getIsFollowerStatus(user?._alias, selectedUser?._alias);

		if (response) {
			return true;
		} else {
			return false;
		}
  };

	public async getFolloweeCount (
    authToken: AuthTokenDto,
    user: UserDto
  ): Promise<number> {
		console.log("user:", user);
    const response = await this.userDao.getUser(user._alias);

		if (!response) {
			throw new Error("Invalid user");
		} else {
			return response.followerCount;
		}
  };

  public async getFollowerCount (
    authToken: AuthTokenDto,
    user: UserDto
  ): Promise<number> {
		console.log("user:", user);
		const response = await this.userDao.getUser(user._alias);

		if (!response) {
			throw new Error("Invalid user");
		} else {
			return response.followingCount;
		}
  };
}