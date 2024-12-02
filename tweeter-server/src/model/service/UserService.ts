import { Buffer } from "buffer";
import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { DaoFactory } from "../daos/DaoFactory";
import { UserDao } from "../daos/UserDao";
import { S3Dao } from "../daos/S3Dao";

export class UserService {
	private userDao: UserDao;
	private s3Dao: S3Dao;


	constructor() {
    this.userDao = DaoFactory.getDao('user') as UserDao;
		this.s3Dao = DaoFactory.getDao('s3') as S3Dao;
	}
	
	public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    // const user = FakeData.instance.firstUser;
		const user = await this.userDao.login(alias, password);

    if (user === null || user === undefined) {
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
		const imageUrl = await this.s3Dao.upload(imageStringBase64);

		if (imageUrl == null) {
			throw new Error("Image not properly saved!");
		}

    const response = await this.userDao.register(
			firstName,
			lastName,
			alias,
			password,
			imageUrl
		)

    if (response === null) {
      throw new Error("Invalid registration");
    }

    return [response.dto, FakeData.instance.authToken.dto];
  };

	public async getUser (
    authToken: AuthTokenDto,
    alias: string
  ): Promise<UserDto | null> {
    const user = await this.userDao.getUser(authToken, alias);

		if (user == null) {
			throw new Error("User does not exist!");
		}

		return user.dto;
  };

	public async logout (authToken: AuthTokenDto): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}