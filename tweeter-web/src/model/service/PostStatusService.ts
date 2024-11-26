import { AuthToken, PostStatusRequest, Status } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../dao/DaoFactory";
export class PostStatusService extends Service {
	private daoFactory: DaoFactory;

	constructor() {

	}

	public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
		await this.sf.postStatus({authToken: authToken.dto, newStatus: newStatus.dto} as PostStatusRequest);
  };
}