import { FakeData, Status, User, UserDto } from "tweeter-shared";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";
import { DaoFactory } from "../daos/DaoFactory";
import { StatusDao } from "../daos/StatusDao";
import { SessionDao } from "../daos/SessionDao";
import { FollowDao } from "../daos/FollowDao";

export class StatusService {
	private dao: StatusDao;
	private sessionDao: SessionDao;
	private followDao: FollowDao;

	constructor() {
		this.dao = DaoFactory.getDao('status');
		this.sessionDao = DaoFactory.getDao('session');
		this.followDao = DaoFactory.getDao('follow');
	}

	async validateSession(token: string) {
		const session = await this.sessionDao.getSession(token);

		if (!session) {
			throw new Error("Invalid auth token!");
		}

		const now = Math.floor(Date.now() / 1000);
		console.log("now:", now);
		console.log("session timestamp:", session.timestamp);
		if (now > session.timestamp) {
			throw new Error("Auth token expired!");
		}

		await this.sessionDao.updateSession(token, now + 3600);
		console.log("Session validated");

		return session;
	}
	
	public async loadMoreFeedItems (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
		try {
			await this.validateSession(authToken);

			const response = await this.dao.getFeedItems(userAlias, pageSize, lastItem?._timestamp);
			if (response.items.length === 0) {
				return [[], false];
			}
			const statuses: StatusDto[] = response.items.map((item: any) => {
				const user: User = new User(
					item.author_first_name.S,
					item.author_last_name.S,
					item.author_alias.S,
					item.author_imageUrl.S
				);
				return {
					_post:item.post, 
					_user: user, 
					_timestamp: item.timestamp};
			});
			return [statuses, response.hasNextPage];
		} catch (error) {
			console.error(error);
			throw new Error(
				`Loading feed items failed:\n${
					(error as Error).message
				}`
			);
		}
  };

	public async loadMoreStoryItems (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
		try {
      await this.validateSession(authToken);

      const response = await this.dao.getStoryItems(userAlias, pageSize, lastItem?._timestamp)
			if (response.items.length === 0) {
				return [[], false];
			}
      const statuses: StatusDto[] = response.items.map((item: any) => {
				const user: User = new User(
					item.author_first_name.S,
					item.author_last_name.S,
					item.author_alias.S,
					item.author_imageUrl.S
				);
				return {
					_post:item.post, 
					_user: user, 
					_timestamp: item.timestamp};
			});
      return [statuses, response.hasNextPage];
    } catch(error) {
      console.error(error);
      throw new Error(
        `Loading story items failed:\n${
          (error as Error).message
        }`
      );
    }
  };

	async postStatus (
		token: string,
		newStatus: StatusDto
	): Promise<void> {
		try {
			await this.validateSession(token);

			await this.dao.saveStatus(newStatus._post, newStatus._user._alias, newStatus._timestamp);
			console.log("Status saved!");

			const followers = await this.followDao.getFollowers(newStatus._user._alias);

			if (followers && followers.length > 0) {
				await this.dao.addStatusToFeeds(newStatus._user, newStatus._timestamp, newStatus._post, followers);
			}
		} catch (error) {
			throw new Error(`Error during posting status: ${error}`);
		}
	}
}