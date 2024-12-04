import { resHeaders } from "./helpers";
import { verifyToken } from "./jwtUtils";
import connectToDatabase from "./mongoUtils";

export async function handleAuthAndDBConnection(event: any) {
    try {
      await connectToDatabase();
  
      const token = event.headers?.Authorization || "";
      const tokenResult = verifyToken(token);
  
      if (tokenResult.statusCode !== 200) {
        return {
          error: true,
          response: {
            statusCode: tokenResult.statusCode,
            body: JSON.stringify({ error: tokenResult.body }),
            headers: resHeaders,
          },
        };
      }
  
      const { userId } = tokenResult.body as { userId: string };
      return { error: false, userId };
    } catch (err) {
      console.error("Error during authentication or DB connection:", err.message || err);
      return {
        error: true,
        response: {
          statusCode: 500,
          body: JSON.stringify({ error: "Internal Server Error" }),
          headers: resHeaders,
        },
      };
    }
  }