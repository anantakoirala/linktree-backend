import jwt from "jsonwebtoken";
export const authToken = (_id: string) => {
  return jwt.sign({ id: _id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export const refreshtToken = (_id: string) => {
  return jwt.sign({ id: _id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
