import { Dao } from "./Dao";
import {
  S3Client,
  PutObjectCommand,
	ObjectCannedACL,
	GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Dao extends Dao {
	private s3Client: S3Client;

	constructor() {
		super();
		this.s3Client = new S3Client({ region: "us-east-1" });
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

			const url = await getSignedUrl(this.s3Client, new GetObjectCommand(getParams), { expiresIn: 3600 });
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