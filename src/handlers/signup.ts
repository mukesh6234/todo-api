import bcrypt from "bcryptjs";
import connectToDatabase from "../utils/mongoUtils";
import User from "../models/User";
import { generateToken } from "../utils/jwtUtils";
import { resHeaders } from "../utils/helpers";

const SALT_ROUNDS = 10;

export const signup = async (event) => {
  try {
    const { firstName, lastName, email, password } = JSON.parse(event.body!);

    if (!firstName || !lastName || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required." }),
        headers: resHeaders,
      };
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "Email is already in use." }),
        headers: resHeaders,
      };
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = generateToken(user);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User created successfully.",
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
