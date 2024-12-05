import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (req: FollowRequest): Promise<FollowResponse> => {
	const followService = new FollowService();
	const [followerCount, followingCount] = await followService.follow(req.authToken, req.userToFollow);

	return {
		success: true,
		message: null,
		followerCount: followerCount,
		followeeCount: followingCount
	}
}