import {
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export abstract class Dao {
	public tableName = "Follows";
  public indexName = "follows_index";
  public follower_handle = "follower_handle";
  public followee_handle = "followee_handle";
  
  private static client: DynamoDBDocumentClient;

	protected constructor() {}

	// Singleton pattern
	public static getInstance() {
		if (!Dao.client) {
			Dao.client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
		}
		return Dao.client;
	}

	abstract get(): any;
	abstract post(): any;
	abstract delete(): any;
	abstract update(): any;
}