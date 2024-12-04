import bcrypt from "bcryptjs";
import connectToDatabase from "../utils/mongoUtils";
import User from "../models/User";
import { generateToken } from "../utils/jwtUtils";
import { resHeaders } from "../utils/helpers";

export const login = async (event) => {
  try {
    console.log(event, "login event");

    const { email, password } = JSON.parse(event.body!);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email and password are required." }),
        headers: resHeaders,
      };
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found." }),
        headers: resHeaders,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid email or password." }),
        headers: resHeaders,
      };
    }

    const token = generateToken(user);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful.",
        token,
        user,
      }),
      headers: resHeaders,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
      headers: resHeaders,
    };
  }
};
