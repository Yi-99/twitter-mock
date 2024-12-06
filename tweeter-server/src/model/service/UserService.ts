import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { DaoFactory } from "../daos/DaoFactory";
import { UserDao } from "../daos/UserDao";
import { S3Dao } from "../daos/S3Dao";
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { SessionDao } from "../daos/SessionDao";

export class UserService {
	private userDao: UserDao;
	private s3Dao: S3Dao;
	private sessionDao: SessionDao;

	constructor() {
    this.userDao = DaoFactory.getDao('user') as UserDao;
		this.s3Dao = DaoFactory.getDao('s3') as S3Dao;
		this.sessionDao = DaoFactory.getDao('session') as SessionDao;
	}
	
	public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
		const user = await this.userDao.login(alias, password);

    if (user === null || user === undefined) {
      throw new Error("Invalid alias or password");
    }

		const authToken = new AuthToken(
			uuidv4(),
			Math.floor((new Date().getTime() + 3600 * 1000) / 1000)
		)

		await this.sessionDao.createSession(alias, authToken.token, authToken.timestamp);

    return [user.dto, authToken.dto];
  };

	public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
  ): Promise<[UserDto, AuthTokenDto]> {
		const existingUser = await this.userDao.getUser(alias);

		if (existingUser && existingUser.alias === alias) {
			throw new Error("User already exists!");
		}

		const imageUrl = await this.s3Dao.upload(imageStringBase64);

		if (imageUrl == null) {
			throw new Error("Image not properly saved!");
		}

		const hashedPassword = await hash(password, 10);

    const response = await this.userDao.register(
			firstName,
			lastName,
			alias,
			hashedPassword,
			imageUrl
		)

		const authToken = new AuthToken(
			uuidv4(),
			Math.floor((new Date().getTime() + 3600 * 1000) / 1000)
		)

		await this.sessionDao.createSession(alias, authToken.token, authToken.timestamp);

    if (response === null) {
      throw new Error("Invalid registration");
    }

    return [response.dto, authToken.dto];
  };

	public async getUser (
    alias: string
  ): Promise<UserDto | null> {
    const user = await this.userDao.getUser(alias);

		if (user == null) {
			throw new Error("User does not exist!");
		}

		return user.dto;
  };

	public async logout (authToken: string): Promise<void> {
		console.log("authToken in logout:", authToken);
    const session = await this.sessionDao.getSession(authToken);

		if (session == undefined) {
			throw new Error("Token not found!");
		}

		try {
			await this.sessionDao.deleteSession(session.auth_token);
			console.log("user logged out successfully!");
			return;
		} catch (error) {
			throw new Error("Failed to log out user: " + error);
		}
  };
}