import { Dao } from "./Dao";
import { Datapage, Follower } from "./FollowDao";

export interface FollowDaoInterface extends Dao {
	loadFollowers(lastItemAlias: string | undefined, pageSize: number, userAlias: string): Promise<Datapage<Follower>>;
	loadFollowees(lastItemAlias: string | undefined, pageSize: number, userAlias: string): Promise<Datapage<Follower>>;
}