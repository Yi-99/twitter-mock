import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (req: LoginRequest): Promise<LoginResponse> => {
	const userService = new UserService();
	const [user, authToken] = await userService.login(req.alias, req.password);
	
	return {
		success: true,
		message: null,
		user: user,
		authToken: authToken
	}
}