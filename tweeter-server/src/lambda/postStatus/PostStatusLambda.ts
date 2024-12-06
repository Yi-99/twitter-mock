import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (req: PostStatusRequest): Promise<PostStatusResponse> => {
	const statusService = new StatusService();
	await statusService.postStatus(req.authToken._token, req.newStatus);

	return {
		success: true,
		message: null
	}
}