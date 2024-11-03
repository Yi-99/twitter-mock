import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

export interface FollowRequest {
	readonly authToken: AuthTokenDto;
	readonly userToFollow: UserDto;
}