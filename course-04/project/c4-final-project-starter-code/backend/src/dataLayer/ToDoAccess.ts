import * as AWS from "aws-sdk";
const AWSXray = require('aws-xray-sdk');
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../interfaces/models";
import { config } from "../common/config";
import { createLogger } from "../utils/logger";

const XAWS = AWSXray.captureAWS(AWS);
const logger = createLogger('todoAccess');


export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = config.todosTableName) {
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        try {
            logger.info("Creating a new todo", todo);

            const params: DocumentClient.PutItemInput = {
                TableName: this.todosTable,
                Item: todo
            };

            await this.docClient.put(params).promise();
            return Promise.resolve(todo);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getAllTodosByUser(userId: string): Promise<TodoItem[]> {
        try {
            logger.info(`Getting all todos with userId ${userId}`);

            const params: DocumentClient.QueryInput = {
                TableName: this.todosTable,
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            };

            const result = await this.docClient.query(params).promise();
            return Promise.resolve(result.Items as TodoItem[]);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

const createDynamoDBClient = () => {
    if (config.isOffline) {
        logger.info("Creating a local DynamoDB instance");
        return new XAWS.DynamoDB.DocumentClient({
            region: "localhost",
            endpoint: "http://localhost:8000"
        });
    }

    return new XAWS.DynamoDB.DocumentClient();
};
