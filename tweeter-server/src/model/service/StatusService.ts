import { FakeData, Status } from "tweeter-shared";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";
import { DaoFactory } from "../daos/DaoFactory";
import { StatusDao } from "../daos/StatusDao";

export class StatusService {
	private dao: StatusDao;

	constructor() {
		this.dao = DaoFactory.getDao('status');
	}
	
	public async loadMoreFeedItems (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  };

	public async loadMoreStoryItems (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  };

	private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
		const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
		const dtos = statuses.map((status) => status.dto);
		return [dtos, hasMore];
	}
}