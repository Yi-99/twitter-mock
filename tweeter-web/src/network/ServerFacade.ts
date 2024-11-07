import {
	AuthToken,
	AuthTokenDto,
	FollowRequest,
  FollowResponse,
  GetFolloweesCountRequest,
  GetFolloweesCountResponse,
  GetFollowersCountRequest,
  GetFollowersCountResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  Status,
  UnfollowRequest,
  UnfollowResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://d0wknwbv4b.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message === null ? undefined : response.message);
    }
  }

	public async getMoreFollowers(
		request: PagedUserItemRequest
	): Promise<[User[], boolean]> {
		const response = await this.clientCommunicator.doPost<
			PagedUserItemRequest,
			PagedUserItemResponse
		>(request, "/follower");

    // Convert the UserDto array returned by ClientCommunicator to a User array
		const items: User[] | null =
			response.success && response.items
				? response.items.map((dto) => User.fromDto(dto) as User)
				: null;

		// Handle errors
		if (response.success) {
			if (items == null) {
				throw new Error('No followers found');
			} else {
				return [items, response.hasMore];
			}
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async follow(
		request: FollowRequest
	): Promise<[followerCount: number, followeeCount: number]> {
		const response = await this.clientCommunicator.doPost<
			FollowRequest,
			FollowResponse
		>(request, "/follow");
		if (response.success) {
			return [response.followerCount, response.followeeCount];
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async unfollow(
		request: UnfollowRequest
	): Promise<[followerCount: number, followeeCount: number]> {
		const response = await this.clientCommunicator.doPost<
			UnfollowRequest,
			UnfollowResponse
		>(request, "/unfollow");
		if (response.success) {
			return [response.followerCount, response.followeeCount];
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async getFolloweesCount(
		request: GetFolloweesCountRequest
	): Promise<number> {
		const response = await this.clientCommunicator.doPost<
			GetFolloweesCountRequest,
			GetFolloweesCountResponse
		>(request, "/followee/count");

		if (response.success) {
			return response.followeeCount;
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async getFollowersCount(
		request: GetFollowersCountRequest
	): Promise<number> {
		const response = await this.clientCommunicator.doPost<
			GetFollowersCountRequest,
			GetFollowersCountResponse
		>(request, "/follower/count");

		if (response.success) {
			return response.followerCount;
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async getIsFollowerStatus(
		request: GetIsFollowerStatusRequest
	): Promise<boolean> {
		const response = await this.clientCommunicator.doPost<
			GetIsFollowerStatusRequest,
			GetIsFollowerStatusResponse
		>(request, "/follower/status");

		if (response.success) {
			return response.isFollower;
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async postStatus(
		request: PostStatusRequest
	): Promise<PostStatusResponse> {
		const response = await this.clientCommunicator.doPost<
			PostStatusRequest,
			PostStatusResponse
		>(request, "/post-status");

		if (response.success) {
			return response;
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async getMoreFeeds(
		request: PagedStatusItemRequest
	): Promise<[Status[], boolean]> {
		const response = await this.clientCommunicator.doPost<
			PagedStatusItemRequest,
			PagedStatusItemResponse
		>(request, "/feed");

		const items: Status[] = 
			response.success && response.items 
			? response.items.map((dto) => { return Status.fromDto(dto)}).filter((item): item is Status => item !== null) 
			: [];

		if (response.success) {
			if (items == null) {
				throw new Error('No feed items found');
			} else {
				return [items, response.hasMore];
			}
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async getMoreStories(
		request: PagedStatusItemRequest
	): Promise<[Status[], boolean]> {
		const response = await this.clientCommunicator.doPost<
			PagedStatusItemRequest,
			PagedStatusItemResponse
		>(request, "/story");

		const items: Status[] | null = 
			response.success && response.items 
			? response.items.map((dto) => Status.fromDto(dto) as Status) 
			: null;

		if (response.success) {
			if (items == null) {
				throw new Error('No feed items found');
			} else {
				return [items, response.hasMore];
			}
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async login(
		request: LoginRequest
	): Promise<[User, AuthToken]> {
		const response = await this.clientCommunicator.doPost<
			LoginRequest,
			LoginResponse
		>(request, "/login");

		const user: UserDto | null = response.user;
		const authToken: AuthTokenDto | null = response.authToken;

		if (response.success) {
			if (user == null) {
				throw new Error('No user found');
			} else if (authToken == null) {
				throw new Error('Invalid Auth Token');
			} else {
				return [User.fromDto(user) as User, AuthToken.fromDto(response.authToken) as AuthToken];
			}
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async logout(
		request: LogoutRequest
	): Promise<void> {
		const response = await this.clientCommunicator.doPost<
			LogoutRequest,
			LoginResponse
		>(request, "/logout");

		if (!response.success) {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async register(
		request: RegisterRequest
	): Promise<[User, AuthToken]> {
		const response = await this.clientCommunicator.doPost<
			RegisterRequest,
			RegisterResponse
		>(request, "/register");

		const user: UserDto | null = response.user;
		const authToken: AuthTokenDto | null = response.authToken;

		if (response.success) {
			if (user == null) {
				throw new Error('No user found');
			} else if (authToken == null) {
				throw new Error('Invalid Auth Token');
			} else {
				return [User.fromDto(user) as User, AuthToken.fromDto(response.authToken) as AuthToken];
			}
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}

	public async getUser(
		request: GetUserRequest
	): Promise<User | null> {
		const response = await this.clientCommunicator.doPost<
			GetUserRequest,
			GetUserResponse
		>(request, "/user");

		const user: UserDto | null = response.user;

		if (response.success && user) {
			return User.fromDto(user) as User;
		} else {
			console.error(response);
			throw new Error(response.message === null ? undefined : response.message);
		}
	}
}