import { User } from "tweeter-shared";
import { Dao } from "./Dao";

export interface StatusDaoInterface extends Dao {
	readonly tableName: string;

	getStoryItems(alias: string, pageSize: number, timestamp: number | undefined): Promise<{ items: any[]; hasNextPage: boolean }>;
	getFeedItems(alias: string, pageSize: number, timestamp: number | undefined): Promise<{ items: any[]; hasNextPage: boolean }>;
	saveStatus(post:string, alias:string, timestamp: number) : Promise<void>;
	addStatusToFeeds(user: User, timestamp: number, post: string, followers: any[]): Promise<void>;
}