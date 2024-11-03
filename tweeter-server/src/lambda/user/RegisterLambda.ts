import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (req: RegisterRequest): Promise<RegisterResponse> => {
	const userService = new UserService();
	const [user, authToken] = await userService.register(
		req.firstName, 
		req.lastName, 
		req.alias, 
		req.password, 
		req.userImageBytes,
		req.imageFileExtension
	);
	
	return {
		success: true,
		message: null,
		user: user,
		authToken: authToken
	}
}