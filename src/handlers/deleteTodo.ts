import Todo from "../models/Todo";
import { resHeaders } from "../utils/helpers";
import { handleAuthAndDBConnection } from "../utils/connection";

export const deleteTodo = async (event) => {
  const authResult = await handleAuthAndDBConnection(event);

  if (authResult.error) return authResult.response;

  const { userId } = authResult;
  try {
    const { id } = event.pathParameters!;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { isDeleted: true },
      { new: true }
    );

    if (!todo) {
      return { statusCode: 404, body: "Todo not found", headers: resHeaders };
    }
    return { statusCode: 200, body: JSON.stringify(todo), headers: resHeaders };
  } catch (err) {
    console.error("Error creating todo:", err.message || err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: resHeaders,
    };
  }
};
