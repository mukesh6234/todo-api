import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface DecodedToken {
  userId: string;
}

export const verifyToken = (
  token: string = ""
): { statusCode: number; body: string | DecodedToken } => {
  if (token === "") {
    return { statusCode: 401, body: "Unauthorized: Token is required" };
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return { statusCode: 200, body: decoded };
  } catch (err) {
    console.error("Token verification failed:", err.message, { token });
    return { statusCode: 401, body: "Unauthorized: Invalid token" };
  }
};

export const generateToken = (user) => {
  try {
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return token;
  } catch {
    throw new Error("Token Generate error");
  }
};
