import { AuthToken } from "tweeter-shared";
import { Dao } from "./Dao";

export interface SessionDaoInterface extends Dao {
	readonly tableName: string;
	
	getSession(authToken: string): Promise<any>;
	updateSession(authToken: string, timestamp: number): Promise<void>;
	createSession(alias: string, authToken: string, timestamp: number): Promise<AuthToken>;
	deleteSession(authToken: string): Promise<boolean>;
}