import { FollowDao } from "./FollowDao";
import { PostStatusDao } from "./PostStatusDao";
import { S3Dao } from "./S3Dao";
import { SessionDao } from "./SessionDao";
import { StatusDao } from "./StatusDao";
import { UserDao } from "./UserDao";

export class DaoFactory {
	public static getDao(type: string): any {
		if (type === 'user') {
			return new UserDao();
		}	else if (type === 's3') {
			return new S3Dao();
		} else if (type === 'status') {
			return new StatusDao();
		} else if (type === 'postStatus') {
			return new PostStatusDao();
		} else if (type === 'session') {
			return new SessionDao();
		} else if (type === 'follow') {
			return new FollowDao();
		} else {
			throw new Error('Invalid DAO type');
		}
	}
}