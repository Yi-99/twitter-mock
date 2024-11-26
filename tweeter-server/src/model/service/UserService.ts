import { Buffer } from "buffer";
import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { DaoFactory } from "../daos/DaoFactory";
import { UserDao } from "../daos/UserDao";

export class UserService {
	private dao: UserDao;

	constructor() {
		this.dao = DaoFactory.getDao('user');
	}
	
	public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  };

	public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  };

	public async getUser (
    authToken: AuthTokenDto,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias)?.dto ?? null;
  };

	public async logout (authToken: AuthTokenDto): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}