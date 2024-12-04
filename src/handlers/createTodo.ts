import Todo from "../models/Todo";
import { resHeaders } from "../utils/helpers";
import { handleAuthAndDBConnection } from "../utils/connection";

export const createTodo = async (event) => {
  const authResult = await handleAuthAndDBConnection(event);
  if (authResult.error) return authResult.response;

  const { userId } = authResult;
  const { title, status, parentTodoId } = JSON.parse(event.body!);
  try {
    const todo = new Todo({
      userId,
      title,
      status,
      parentTodoId: parentTodoId || null,
    });
    const newTodo = await todo.save();
    if (parentTodoId) {
      await Todo.findByIdAndUpdate(parentTodoId, {
        $addToSet: { childrenIds: newTodo._id },
      });
    }
    return {
      statusCode: 201,
      body: JSON.stringify(todo),
      headers: resHeaders,
    };
  } catch (err) {
    console.error("Error creating todo:", err.message || err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: resHeaders,
    };
  }
};
