import { GetFollowersCountRequest, GetFollowersCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (req: GetFollowersCountRequest): Promise<GetFollowersCountResponse> => {
	const followService = new FollowService();
	const followerCount = await followService.getFollowerCount(req.authToken, req.user);

	return {
		success: true,
		message: null,
		followerCount: followerCount
	}
}