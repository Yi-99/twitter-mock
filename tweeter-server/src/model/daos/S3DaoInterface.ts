import { Dao } from "./Dao";

export interface S3DaoInterface extends Dao {
	upload(imageStringBase64: string): Promise<string>;
}