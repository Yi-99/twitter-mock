import { GetFolloweesCountRequest, GetFolloweesCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (req: GetFolloweesCountRequest): Promise<GetFolloweesCountResponse> => {
	const followService = new FollowService();
	const followeeCount = await followService.getFolloweeCount(req.authToken, req.user);

	return {
		success: true,
		message: null,
		followeeCount: followeeCount
	}
}