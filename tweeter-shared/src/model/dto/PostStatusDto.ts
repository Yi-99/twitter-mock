import { AuthTokenDto } from "./AuthTokenDto";

export interface PostStatusDto {
		readonly _authToken: AuthTokenDto;
		readonly _statusText: string;
}