import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

export interface UnfollowRequest {
	readonly authToken: AuthTokenDto;
	readonly userToUnfollow: UserDto;
}