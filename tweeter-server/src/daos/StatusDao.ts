import { StatusDto } from "tweeter-shared";

export interface StatusDao {
	getFeedItems(item: StatusDto, pageSize: number): Promise<[StatusDto[], boolean]>;
	getStoryItems(item: StatusDto, pageSize: number): Promise<[StatusDto[], boolean]>;
}