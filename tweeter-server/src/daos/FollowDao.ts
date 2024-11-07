import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface FollowDao {
	getFollowers(authToken: AuthTokenDto, alias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
	getFollowees(authToken: AuthTokenDto, alias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
	follow(authToken: AuthTokenDto, user: UserDto): Promise<[followerCount: number, followeeCount: number]>;
	unfollow(authToken: AuthTokenDto, user: UserDto): Promise<[followerCount: number, followeeCount: number]>;
	getIsFollower(authToken: AuthTokenDto, alias: string): Promise<boolean>;
	getFollowersCount(authToken: AuthTokenDto, alias: string): Promise<number>;
	getFolloweesCount(authToken: AuthTokenDto, alias: string): Promise<number>;
}