import { AuthToken, PostStatusRequest, Status } from "tweeter-shared";
import { Service } from "./Service";

export class PostStatusService extends Service {
	public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
		await this.sf.postStatus({authToken: authToken.dto, newStatus: newStatus.dto} as PostStatusRequest);
  };
}