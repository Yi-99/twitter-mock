import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

export interface GetFollowersCountRequest {
	readonly authToken: AuthTokenDto;
	readonly user: UserDto;
}