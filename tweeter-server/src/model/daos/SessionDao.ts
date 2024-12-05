import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Dao } from "./Dao";
import { v4 as uuid4 } from "uuid";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";

export class SessionDao extends Dao {
	constructor() {
		super();
		// this.tableName = "session";
		this.tableName = "sessions";
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

	async createSession(alias: string) {
		const session = {
			"auth_token": uuid4(),
			"timestamp": Math.floor(Date.now() / 1000) + 3600,
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