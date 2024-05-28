import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("Serializing user");
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user");
    try {
      const user = await User.findById(id);
      done(null, user._id);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, passport, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return new Error("Invalid credentials");
        }
        const validPassport = await bcrypt.compare(passport, user.password);
        if (!validPassport) {
          return new Error("Invalid credentials");
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );
};
