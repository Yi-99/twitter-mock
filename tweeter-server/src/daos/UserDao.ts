import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface UserDao {
	login(alias:string, password:string): Promise<[UserDto, AuthTokenDto]>;
	register(
		firstName:string, 
		lastName:string, 
		alias:string, 
		password:string, 
		imageStringBase64:string
	): Promise<[UserDto, AuthTokenDto]>;
	getUser(authToken:AuthTokenDto, alias:string): Promise<UserDto | null>;
}