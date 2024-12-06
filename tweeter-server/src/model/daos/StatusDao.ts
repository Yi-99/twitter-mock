import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { Dao } from "./Dao";
import { Status, User } from "tweeter-shared";
import { BatchWriteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { StatusDaoInterface } from "./StatusDaoInterface";

export class StatusDao implements StatusDaoInterface {
	public tableName: string;
	public indexName: string;
	public follower_handle: string;
	public followee_handle: string;

	constructor() {
		this.tableName = "statuses";
		this.indexName = "";
		this.follower_handle = "author_alias";
		this.followee_handle = "timestamp";
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

	async getStoryItems(alias: string, pageSize: number, timestamp: number | undefined) {
		const params: any = {
			TableName: this.tableName,
			KeyConditionExpression: "author_alias = :authorAlias",
			ExpressionAttributeValues: {
				":authorAlias": { "S": alias }
			},
			Limit: pageSize,
			ExclusiveStartKey: timestamp
				? { author_alias: { "S": alias }, timestamp: { "N": timestamp } }
				: undefined,
			ScanIndexForward: false,
		};

		try {
			const response = await Dao.getInstance().send(new QueryCommand(params));
			const stories = response.Items as unknown as Status[];
			return {
				items: stories || [],
				hasNextPage: !!response.LastEvaluatedKey
			}
		} catch (error) {
			console.error("Error retrieving story:", error);
			throw error;
		}
	}

	async getFeedItems(alias: string, pageSize: number, timestamp: number | undefined) {
		const params: any = {
			TableName: this.tableName,
			KeyConditionExpression: "author_alias = :authorAlias",
			ExpressionAttributeValues: {
				":authorAlias": { "S": alias }
			},
			Limit: pageSize,
			ExclusiveStartKey: timestamp
				? { author_alias: { "S": alias }, timestamp: { "N": timestamp } }
				: undefined,
			ScanIndexForward: false,
		};

		try {
			const response = await Dao.getInstance().send(new QueryCommand(params));
			const feeds = response.Items as unknown as Status[];
			return {
				items: feeds || [],
				hasNextPage: !!response.LastEvaluatedKey
			}
		} catch (error) {
			console.error("Error retrieving feed:", error);
			throw error;
		}
	}

	async saveStatus(post: string, alias: string, timestamp: number) {
		const params = {
			TableName: this.tableName,
			Item: {
				"author_alias": alias,
				"timestamp": timestamp,
				"post": post
			}
		}

		try {
			await Dao.getInstance().send(new PutCommand(params));
		} catch (error) {
			console.error("Error saving status:", error);
			throw error;
		}
	}

	async addStatusToFeeds(user: User, timestamp: number, post: string, followers: any[]) {
		console.log("addStatusToFeeds");
		this.tableName = "feeds";
		const requests = followers.map((follower: any) => ({
			PutRequest: {
				Item: {
					"author_alias": follower.S,
					"timestamp": timestamp.toString(),
					"post": post,
					"author_first_name": user.firstName ,
					"author_last_name": user.lastName,
					"author_imageUrl": user.imageUrl,
				}
			}
		}));

		const params = {
			RequestItems: {
				[this.tableName]: requests
			}
		}

		try {
			await Dao.getInstance().send(new BatchWriteCommand(params));
			console.log("Status added to feeds!");
		} catch (error) {
			console.error("Error adding status to feed:", error);
			throw error;
		}
	}
}