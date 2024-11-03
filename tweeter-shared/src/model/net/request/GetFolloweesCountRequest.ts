import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

export interface GetFolloweesCountRequest {
	readonly authToken: AuthTokenDto;
	readonly user: UserDto;
}