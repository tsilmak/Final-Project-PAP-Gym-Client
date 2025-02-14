import pkg from "jsonwebtoken";
const { sign } = pkg;

// Function to generate a refresh token
export const generateRefreshToken = async (data: string | object) => {
  const expiresIn = "15m";
  if (!process.env.REFRESH_TOKEN_SECRET) {
    console.error(
      "REFRESH_TOKEN_SECRET não foi informado! A terminar a aplicação..."
    );
    process.exit(1);
  }
  // Generate a refresh token using the provided data
  const refreshToken = sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn, // Set expiration time
  });

  return refreshToken; // Return the generated refresh token
};
