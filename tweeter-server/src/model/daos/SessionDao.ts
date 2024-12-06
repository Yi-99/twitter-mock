import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Dao } from "./Dao";
import { v4 as uuid4 } from "uuid";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";
import { SessionDaoInterface } from "./SessionDaoInterface";

export class SessionDao implements SessionDaoInterface {
	readonly tableName: string;
	readonly indexName: string;
	readonly follower_handle: string;
	readonly followee_handle: string;

	constructor() {
		this.tableName = 'session';
		this.indexName = '';
		this.follower_handle = '';
		this.followee_handle = '';
	}
	
	readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

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

	async getSession(authToken: string) {
		console.log("getSEssion:", authToken);
		const params = {
			TableName: this.tableName,
			Key: {
				"auth_token": authToken
			}
		}

		try {
			const response = await Dao.getInstance().send(new GetCommand(params));
			return response.Item;
		} catch (error) {
			throw new Error("Failed to get session with: " + error);
		}
	}

	async updateSession(authToken: string, timestamp: number) {
		try {
			const params = {
				TableName: this.tableName,
				Key: {
					"auth_token": authToken
				},
				ExpressionAttributeNames: {
					"#timestamp": "timestamp"
				},
				ExpressionAttributeValues: {
					":timestamp": timestamp,
				},
				UpdateExpression: "SET #timestamp = :timestamp"
			}
			
			await Dao.getInstance().send(new UpdateCommand(params));
		} catch (error) {
			throw new Error("Failed to update session with: " + error);
		}
	}

	async deleteSession(authToken: string) {
		const params = {
			TableName: this.tableName,
			Key: {
				"auth_token": authToken
			}
		}

		try {
			const response = await Dao.getInstance().send(new DeleteCommand(params));
			console.log("session successfully deleted!", authToken);
			return response.$metadata.httpStatusCode === 200;
		} catch (error) {
			throw new Error("Failed to delete session with: " + error);
		}
	}

	async createSession(alias: string, authToken: string, timestamp: number) {
		const session = {
			"auth_token": authToken,
			"timestamp": timestamp,
			"alias": alias
		}

		const params = {
			TableName: this.tableName,
			Item: session
		}

		try {
			await Dao.getInstance().send(new PutCommand(params));
			return new AuthToken(session.auth_token, session.timestamp);
		} catch (error) {
			throw new Error("Failed to create session with: " + error);
		}
	}
}