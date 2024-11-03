import { AuthTokenDto } from "./AuthTokenDto";

export interface PostStatusDto {
		readonly authToken: AuthTokenDto;
		readonly statusText: string;
}