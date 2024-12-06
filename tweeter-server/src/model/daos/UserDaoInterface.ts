import { User } from "tweeter-shared";
import { Dao } from "./Dao";

export interface UserDaoInterface extends Dao {
	readonly tableName: string;

	login(alias: string, password: string): Promise<User>;
	register(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): Promise<User>;
	getUser(alias: string): Promise<any>;
}