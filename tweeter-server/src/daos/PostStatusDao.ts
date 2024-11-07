import { AuthTokenDto, StatusDto } from "tweeter-shared";

export interface PostStatusDao {
	postStatus(authToken: AuthTokenDto, newStatus: StatusDto): Promise<void>;
}