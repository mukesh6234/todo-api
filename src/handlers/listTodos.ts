import connectToDatabase from "../utils/mongoUtils";
import Todo from "../models/Todo";
import { verifyToken } from "../utils/jwtUtils";
import { resHeaders } from "../utils/helpers";

export const listTodos = async (event) => {
  try {
    await connectToDatabase();

    const token = event.headers?.Authorization || "";
    const tokenResult = verifyToken(token);

    if (tokenResult.statusCode !== 200) {
      return {
        statusCode: tokenResult.statusCode,
        body: JSON.stringify({ error: tokenResult.body }),
        headers: resHeaders,
      };
    }

    const { userId } = tokenResult.body as { userId: string };

    const queryParams = event.queryStringParameters || {};
    const searchTitle = queryParams.title || "";

    const query: any = {
      userId,
      isDeleted: false,
      parentTodoId: null,
    };

    if (searchTitle) {
      query.title = { $regex: searchTitle, $options: "i" };
    }

    const todos = await Todo.find(query).populate({
      path: "childrenIds",
      match: { isDeleted: false },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(todos),
      headers: resHeaders,
    };
  } catch (err) {
    console.error("Error in listTodos:", err.message || err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: resHeaders,
    };
  }
};
