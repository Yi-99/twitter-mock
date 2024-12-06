import { Dao } from "./Dao";
import {
  S3Client,
  PutObjectCommand,
	ObjectCannedACL,
	GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3DaoInterface } from "./S3DaoInterface";

export class S3Dao implements S3DaoInterface {
	private s3Client: S3Client;
	public tableName: string;
	public indexName: string;
	public follower_handle: string;
	public followee_handle: string;

	constructor() {
		this.s3Client = new S3Client({ region: "us-east-1" });
		this.tableName = 's3';
		this.indexName = '';
		this.follower_handle = '';
		this.followee_handle = '';
	}

	get() {
		throw new Error("Method not implemented.");
	}
	post() {
		throw new Error("Method not implemented");
	}
	async upload(imageStringBase64: string) {
		const key = `images/${new Date().getTime()}.png`;
		const fileContent: Buffer = Buffer.from(imageStringBase64, "base64");
		try {
			const params = {
				Body: fileContent,
				Bucket: "cs340f2024",
				Key: key,
			}

			const command = new PutObjectCommand(params);
			const response = await this.s3Client.send(command);
				
			console.log("File upload successful with ", response.$metadata.httpStatusCode);

			const getParams = {
				Bucket: "cs340f2024",
				Key: key,
			}

			const url = await getSignedUrl(this.s3Client, new GetObjectCommand(getParams), { expiresIn: 3600 * 24 }); // 24 hours
			return url;
		} catch (error) {
			throw new Error("S3 upload failed with: " + error);
		}
	}
	delete() {
		throw new Error("Method not implemented.");
	}
	update() {
		throw new Error("Method not implemented.");
	}
}