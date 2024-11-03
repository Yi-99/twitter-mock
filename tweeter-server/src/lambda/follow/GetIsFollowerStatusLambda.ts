import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (req: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
	const followService = new FollowService();
	const isFollower = await followService.getIsFollowerStatus(req.authToken, req.user, req.selectedUser);

	return {
		success: true,
		message: null,
		isFollower
	}
}