import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (req: UnfollowRequest): Promise<UnfollowResponse> => {
	const followService = new FollowService();
	const [followerCount, followeeCount] = await followService.unfollow(req.authToken, req.userToUnfollow);

	return {
		success: true,
		message: null,
		followerCount: followerCount,
		followeeCount: followeeCount
	}
}