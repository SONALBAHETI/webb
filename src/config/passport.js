import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "./config.js";
import { tokenTypes } from "./tokens.js";
import User from "../models/user.model.js";

const extractJwtFromCookie = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies["accessToken"];
  }

  return jwt;
};

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    extractJwtFromCookie, // this is a custom extractor to extract the JWT from the cookie
    ExtractJwt.fromAuthHeaderAsBearerToken(), // if you are using Bearer <token> Authorization header
  ]),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
