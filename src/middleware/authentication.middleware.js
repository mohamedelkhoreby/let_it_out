import { tokenModel } from "../database/models/token.model.js";
import { userModel } from "../database/models/user.model.js";
import * as dbServices from "../database/services/db_service.js";
import { decodedToken } from "../utils/jwt.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const decoded = decodedToken(authHeader);

    const tokenInDb = await dbServices.findOne({
      data: { jti: decoded.jti },
      model: tokenModel,
    });

    if (tokenInDb && tokenInDb.revoked) {
      return res.status(401).json({ message: "Token has been revoked" });
    }
   
   /*  if (decoded.iat * 1000 < user.tokensInvalidBefore.getTime()) {
      throw new Error("Token revoked");
    } */
    const user = await userModel.findById(decoded.id);
    if (!user || user.freezeUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.user = user;
    req.token = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message || "Unauthorized" });
  }
};
