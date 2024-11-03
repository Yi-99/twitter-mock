import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (req: LogoutRequest): Promise<LogoutResponse> => {
	const userService = new UserService();
	await userService.logout(req.authToken);
	
	return {
		success: true,
		message: null
	}
}