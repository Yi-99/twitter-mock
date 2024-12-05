import { User, UserDto } from "tweeter-shared";
import { Dao } from "./Dao";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

interface Datapage<T> {
	items: T[];
	hasNextPage: boolean;
}

interface Follower {
	follower_handle: string;
	followee_handle: string;
	follower_name: string;
	followee_name: string;
}

export class FollowDao extends Dao {
	constructor() {
		super();
		this.tableName = "follows";
	}

	get() {
		throw new Error("Method not implemented.");
	}
	post() {
		throw new Error("Method not implemented.");
	}
	delete() {
		throw new Error("Method not implemented.");
	}
	update() {
		throw new Error("Method not implemented.");
	}

	readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-west-1' }));

	async loadFollowers(lastItemAlias: string | undefined, pageSize: number, userAlias: string): Promise<Datapage<Follower>> {
		const input: any = {
			TableName: this.tableName,
			KeyConditionExpression: `follower_handle = :handle`,
			ExpressionAttributeValues: {
				":handle": { "S": userAlias },
			},
			Limit: pageSize,
			ExclusiveStartKey: lastItemAlias
        ? { 
					[this.follower_handle]: { "S": userAlias }, 
					[this.followee_handle]: { "S": lastItemAlias } 
				}
        : undefined,
		};

		const response = await Dao.getInstance().send(new QueryCommand(input));
		const followers = response.Items as unknown as Follower[];
		console.log("Followers:", followers);
		return {
			items: followers,
			hasNextPage: !!response.LastEvaluatedKey
		};
	}

	async loadFollowees(lastItemAlias: string | undefined, pageSize: number, userAlias: string) {
		const input: any = {
			TableName: this.tableName,
			IndexName: this.indexName,
			KeyConditionExpression: `followee_handle = :handle`,
			ExpressionAttributeValues: {
				":handle": { "S": userAlias },
			},
			Limit: pageSize,
			ExclusiveStartKey: lastItemAlias
			? { 
				[this.follower_handle]: { "S": lastItemAlias }, 
				[this.followee_handle]: { "S": userAlias }
			}
			: undefined,
		};

		const response = await Dao.getInstance().send(new QueryCommand(input));
		const followees = response.Items as unknown as Follower[];
		console.log("Followees:", followees);
		return {
			items: followees,
			hasNextPage: !!response.LastEvaluatedKey
		};
	}

	async follow(alias: string, userToFollow: User) {
		const params: any = {
			TableName: this.tableName,
			Item: {
				[this.follower_handle]: '@' + alias,
				[this.followee_handle]: userToFollow.alias,
				"follower_name": alias,
				"followee_name": userToFollow.alias,
			}
		}

		const response = await Dao.getInstance().send(new PutCommand(params));
		return response.$metadata.httpStatusCode === 200;
	}

	async unfollow(alias: string, userToUnfollow: User) {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.follower_handle]: '@' + alias,
				[this.followee_handle]: userToUnfollow.alias,
				"follower_name": alias,
				"followee_name": userToUnfollow.alias,
			},
		};

		const response = await Dao.getInstance().send(new DeleteCommand(params));
		return response.$metadata.httpStatusCode === 200;
	}

	async getIsFollowerStatus(user: User, selectedUser: User) {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.follower_handle]: user.alias,
				[this.followee_handle]: selectedUser.alias,
			},
		};

		const response = await Dao.getInstance().send(new GetCommand(params));
		return response.Item !== undefined;
	}

	async getFolloweeCount(user: User) {
		const params: any = {
			TableName: "users",
			Key: {
				"alias": user.alias,
			}
		};

		const response = await Dao.getInstance().send(new GetCommand(params));
		return response.Item?.followingCount;
	}

	async getFollowerCount(user: User) {
		const params: any = {
			TableName: "users",
			Key: {
				"alias": user.alias,
			}
		};

		const response = await Dao.getInstance().send(new GetCommand(params));
		return response.Item?.followerCount;
	}
}