import { Dao } from "./Dao";
import fs from "fs";
import {
  S3Client,
  PutObjectCommand,
	GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Dao extends Dao {
	private s3Client: S3Client;

	constructor() {
		super();
		this.s3Client = new S3Client({ region: process.env.AWS_REGION, endpoint: "https://s3-us-east-1.amazonaws.com" });
	}
	get() {
		throw new Error("Method not implemented.");
	}
	post() {
		throw new Error("Method not implemented");
	}
	async upload(imageStringBase64: string) {
		const fileContent = fs.readFileSync(imageStringBase64);
		const key = `${new Date().getTime()}.png`;
		const params = {
			"Body": fileContent,
			"Bucket": process.env.AWS_BUCKET,
			"Key": key,
		}

		const command = new PutObjectCommand(params);
		try {
			const response = await this.s3Client.send(command);
			
			console.log("File upload successful with ", response.$metadata.httpStatusCode);
			const getParams = {
				Bucket: process.env.AWS_BUCKET,
				Key: key
			}
			const getCommand = new GetObjectCommand(getParams);
			const imageUrl = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });
			return imageUrl;
		} catch (error) {
			console.log(error);
		}
	}
	delete() {
		throw new Error("Method not implemented.");
	}
	update() {
		throw new Error("Method not implemented.");
	}
}