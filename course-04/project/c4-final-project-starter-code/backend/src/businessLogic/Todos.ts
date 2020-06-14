import * as uuid from "uuid";
import {CreateTodoRequest} from "../interfaces/requests";
import {TodoItem} from "../interfaces/models";
import {TodoAccess} from "../dataLayer/todoAccess";
import {APIGatewayProxyEvent} from "aws-lambda";
import {AuthHelper} from "../utils/authHelper";

const todoAccess = new TodoAccess();


export const createTodo = async (request: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> => {
    const todoId = uuid.v4();
    const userId = AuthHelper.getUserId(event);

    return await todoAccess.createTodo({
        createdAt: new Date().toISOString(),
        done: false,
        dueDate: request.dueDate,
        name: request.name,
        todoId,
        userId,
        attachmentUrl: ""
    });
};
