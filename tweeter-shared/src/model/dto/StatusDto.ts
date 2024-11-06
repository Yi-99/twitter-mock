import { User } from "../domain/User";

export interface StatusDto {
	readonly _post: string;
	readonly _user: User;
	readonly _timestamp: number;
}