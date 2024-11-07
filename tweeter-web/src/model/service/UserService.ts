import { Buffer } from "buffer";
import { 
	AuthToken,
	FakeData, 
	User, 
	LoginRequest, 
	LogoutRequest, 
	GetUserRequest, 
	RegisterRequest
} from "tweeter-shared";
import { Service } from "./Service";

export class UserService extends Service {
	public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
		const [user, authToken] = await this.sf.login({alias, password} as LoginRequest);

		if (user === null) {
			throw new Error("Invalid alias or password");
		} else if (authToken === null) {
			throw new Error("Invalid Auth Token");
		}

		return [user, authToken];
  };

	public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return await this.sf.register({
			firstName,
			lastName,
			alias,
			password,
			imageStringBase64,
		} as RegisterRequest);
  };

	public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
		console.log("Get User:", authToken, alias);
    return await this.sf.getUser({authToken: authToken.dto, userAlias: alias} as GetUserRequest);
  };

	public async logout (authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    return await this.sf.logout({authToken} as LogoutRequest);
  };
}