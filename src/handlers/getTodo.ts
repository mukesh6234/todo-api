import connectToDatabase from "../utils/mongoUtils";
import Todo from "../models/Todo";
import { verifyToken } from "../utils/jwtUtils";
import { resHeaders } from "../utils/helpers";

export const getTodo = async (event) => {
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

    const userId = verifyToken(event?.headers?.Authorization || "");

    const { id } = event.pathParameters!;

    const todo = await Todo.findOne({
      _id: id,
      userId,
      isDeleted: false,
    }).populate({
      path: "childrenIds",
      match: { isDeleted: false },
    });

    if (!todo) {
      return { statusCode: 404, body: "Todo not found" };
    }

    const responseBody = {
      todo,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(responseBody),
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
