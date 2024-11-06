import { AuthTokenDto, StatusDto } from "tweeter-shared";

export class PostStatusService {
	public async postStatus (
    authToken: AuthTokenDto,
    newStatus: StatusDto
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };
}