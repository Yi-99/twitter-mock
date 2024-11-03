import { AuthToken } from "../../domain/AuthToken";

export interface LogoutRequest {
	readonly authToken: AuthToken;
}