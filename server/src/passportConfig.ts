import passport from "passport";
import { Profile, Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request } from "express";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "YOUR_CLIENT_SECRET";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      _req: Request,
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: any
    ) => {
      // find or create the user in your DB here
      console.log("Google profile:", profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;
