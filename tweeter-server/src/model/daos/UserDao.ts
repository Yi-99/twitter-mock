import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Dao } from "./Dao";
import { AuthTokenDto, User } from "tweeter-shared";

export class UserDao extends Dao {
	constructor() {
		super();
		this.tableName = "users"
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

	async login(alias: string, password: string) {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.follower_handle]: alias,
				[this.followee_handle]: password,
			}
		}

		const response = await Dao.getInstance().send(new GetCommand(params));

		if (response.Item != undefined) {
			const user = new User(
				response.Item.firstName,
				response.Item.lastName,
				response.Item.alias,
				response.Item.imageUrl
			)

			return user;
		} else {
			throw new Error("Unable to login")
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
				alias: alias,
				password: password,
				firstName: firstName,
				lastName: lastName,
				imageUrl: imageUrl
			}
		}

		try {
			const response = await Dao.getInstance().send(new PutCommand(params));

			if (response.$metadata.httpStatusCode === 200) {
				const user = new User(
					alias,
					firstName,
					lastName,
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

	async getUser(authToken: AuthTokenDto, alias: string) {
		if (!authToken) {
			throw new Error('Invalid auth token: Action not authorized!');
		}

		const params = {
			TableName: this.tableName,
			Key: {
				[this.follower_handle]: alias
			}
		}

		const response = await Dao.getInstance().send(new GetCommand(params));
		if (response.Item != undefined) {
			return new User(
				response.Item.firstName,
				response.Item.lastName,
				response.Item.alias,
				response.Item.imageUrl
			)
		}
	}
}