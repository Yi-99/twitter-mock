import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { PostStatusService } from "../../model/service/PostStatusService";

export const handler = async (req: PostStatusRequest): Promise<PostStatusResponse> => {
	const postStatusService = new PostStatusService();
	await postStatusService.postStatus(req.authToken, req.newStatus);

	return {
		success: true,
		message: null
	}
}