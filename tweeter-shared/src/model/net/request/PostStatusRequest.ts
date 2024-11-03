import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { StatusDto } from "../../dto/StatusDto";

export interface PostStatusRequest {
	readonly authToken: AuthTokenDto;
	readonly newStatus: StatusDto;
}