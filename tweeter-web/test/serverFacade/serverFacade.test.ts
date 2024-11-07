import { GetFollowersCountRequest, PagedUserItemRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from '../../src/network/ServerFacade';

describe("Server Facade", () => {
	let sf: ServerFacade;
	const firstName = 'Allen';
	const lastName = 'test';
	const alias = 'testUser';
	const password = 'password';
	const imageStringBase64 = 'imageStringBase64';

	const token = 'token';

	beforeAll(() => {
		sf = new ServerFacade();
	});

	it("should register user", async () => {
		const [user, authToken] = await sf.register(
			{
				firstName,
				lastName,
				alias,
				password,
				imageStringBase64,
			} as RegisterRequest
		)

		expect(user).not.toBeNull();
		expect(authToken).not.toBeNull();
	});

	it('should load followers', async () => {
		const [users, hasMore] = await sf.getMoreFollowers(
			{
				token, 
				userAlias: alias,
				pageSize: 10,
				lastItem: null
			} as PagedUserItemRequest
		);

		expect(users).not.toBeNull();
		expect(hasMore).not.toBeNull();
	})

	it('should get followers count', async () => {
		const followerCount = await sf.getFollowersCount(
			{
				authToken: {
					_token: token,
					_timestamp: 0
				},
				user: {
					_firstName: firstName,
					_lastName: lastName,
					_alias: alias,
					_imageUrl: imageStringBase64
				}
			} as GetFollowersCountRequest
		)

		expect(followerCount).not.toBeNull();
	})
})