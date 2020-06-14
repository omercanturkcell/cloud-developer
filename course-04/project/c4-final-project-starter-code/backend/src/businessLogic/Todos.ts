import * as uuid from "uuid";
import {CreateTodoRequest, UpdateTodoRequest} from "../interfaces/requests";
import {TodoItem, TodoUpdate} from "../interfaces/models";
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

export const getAllTodosByUser = async (event: APIGatewayProxyEvent): Promise<TodoItem[]> => {
    const userId = AuthHelper.getUserId(event);
    return await todoAccess.getAllTodosByUser(userId);
};

export const getTodo = async (todoId: string, event: APIGatewayProxyEvent): Promise<TodoItem> => {
    const userId = AuthHelper.getUserId(event);
    return await todoAccess.getTodo(todoId, userId);
};

export const deleteTodo = async (todoId: string, event: APIGatewayProxyEvent): Promise<void> => {
    const userId = AuthHelper.getUserId(event);
    return await todoAccess.deleteTodo(todoId, userId);
};

export const updateTodo = async (todoId: string, request: UpdateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoUpdate> => {
    const userId = AuthHelper.getUserId(event);
    return await todoAccess.updateTodo(todoId, userId, request);
};
