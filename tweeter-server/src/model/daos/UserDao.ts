import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Dao } from "./Dao";
import { User } from "tweeter-shared";
import { compare } from 'bcryptjs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDaoInterface } from "./UserDaoInterface";

export class UserDao implements UserDaoInterface {
	public tableName: string;
	public indexName: string;
	public follower_handle: string;
	public followee_handle: string;

	constructor() {
		this.tableName = "users";
		this.indexName = "";
		this.follower_handle = "alias";
		this.followee_handle = "";
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

	async login(alias: string, password: string) {
		const params = {
			TableName: this.tableName,
			Key: {
				"alias": alias
			}
		}

		const response = await Dao.getInstance().send(new GetCommand(params));

		if (response.Item != undefined) {
			// check if the password is correct
			if (await compare(password, response.Item.password)) {
				console.log("user logged in:", response.Item as User);
				return new User(
					response.Item.firstName,
					response.Item.lastName,
					response.Item.alias,
					response.Item.imageUrl
				);
			} else {
				throw new Error("Incorrect password!");
			}
		} else {
			throw new Error("No user with that username!");
		}
	}

	async register(
		firstName: string, 
		lastName: string, 
		alias: string, 
		password: string, 
		imageUrl: string
	): Promise<User> {
		const params = {
			TableName: this.tableName,
			Item: {
				"alias": alias,
				"password": password,
				"firstName": firstName,
				"lastName": lastName,
				"imageUrl": imageUrl,
				"followerCount": 0,
				"followingCount": 0
			}
		}

		try {
			const response = await Dao.getInstance().send(new PutCommand(params));

			if (response.$metadata.httpStatusCode === 200) {
				const user = new User(
					firstName,
					lastName,
					alias,
					imageUrl
				)

				return user;
			} else {
				throw new Error('Error registering user');
			}
		} catch (error) {
			throw new Error('Error registering user');
		}
	}

	async getUser(alias: string) {
		const params = {
			TableName: this.tableName,
			Key: {
				"alias": alias,
			}
		}

		const response = await this.client.send(new GetCommand(params));
		if (response.Item != undefined) {
			return response.Item;
		}
	}

	async updateCount(val: string, attributeName: string, num: number) {
		const params: any = {
			TableName: this.tableName,
			Key: {
				alias: val
			},
			UpdateExpression: `SET ${attributeName} = if_not_exists(${attributeName}, :start) + :change`,
			ExpressionAttributeValues: {
				":start": 0, 
				":change": num, 
			},
			ReturnValues: "ALL_NEW",
		}

		const response = await Dao.getInstance().send(new UpdateCommand(params));
		console.log("UpdateCount:", response);
		return response.Attributes;
	}
}