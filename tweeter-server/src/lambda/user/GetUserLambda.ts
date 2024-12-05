import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (req: GetUserRequest): Promise<GetUserResponse> => {
	const userService = new UserService();
	const user = await userService.getUser(req.userAlias);

	if (!user) {
		return {
			success: false,
			message: "User not found",
			user: null
		}
	}
	
	return {
		success: true,
		message: null,
		user: user
	}
}