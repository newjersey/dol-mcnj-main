import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = process.env.DDB_TABLE_NAME || "marketing-userEmails";

if (!TABLE_NAME) {
  throw new Error("DDB_TABLE_NAME is missing in environment variables.");
}

const ddb = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddb, {
  marshallOptions: { removeUndefinedValues: true },
});

/**
 * Insert a new subscriber record; if an email already exists, we *update* names.
 * - Idempotent: same email won't create duplicates (PK = email).
 * - You can switch to strict "no overwrite" by using Put + ConditionExpression.
 */
export const addSubscriberToDynamo = async (
  fname: string,
  lname: string,
  email: string /* phone?: string */
) => {
  if (!email) throw new Error("Email address is required.");

  const nowIso = new Date().toISOString();

  try {
    const betterCmd = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { email },
      UpdateExpression: `
        SET #FNAME = :fname,
            #LNAME = :lname,
            #STATUS = :status,
            #UPDATED_AT = :updatedAt,
            #CREATED_AT = if_not_exists(#CREATED_AT, :createdAt)
      `,
      ExpressionAttributeNames: {
        "#FNAME": "fname",
        "#LNAME": "lname",
        "#STATUS": "status",
        "#UPDATED_AT": "updatedAt",
        "#CREATED_AT": "createdAt"
      },
      ExpressionAttributeValues: {
        ":fname": fname || null,
        ":lname": lname || null,
        ":status": "subscribed",
        ":updatedAt": nowIso,
        ":createdAt": nowIso
      },
      ReturnValues: "ALL_NEW"
    });

    const resp = await docClient.send(betterCmd);
    return resp.Attributes; // contains the saved subscriber
    } catch (error) {
      console.error(`Error while saving emails in dynamodb: `, error);
      throw error
    }
};
