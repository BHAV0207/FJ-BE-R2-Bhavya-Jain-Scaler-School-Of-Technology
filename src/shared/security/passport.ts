import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { env } from "../../config/env.js";

import * as userRepository from "../../modules/user/user.repository.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,

      clientSecret:
        env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        env.GOOGLE_CALLBACK_URL,
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done,
    ) => {
      try {
        const googleId = profile.id;

        const email =
          profile.emails?.[0]?.value;

        const name =
          profile.displayName;

        if (!email) {
          return done(
            new Error(
              "Google account has no email",
            ),
          );
        }

        let user =
          await userRepository.findByGoogleId(
            googleId,
          );

        if (user) {
          return done(
            null,
            user,
          );
        }

        user =
          await userRepository.findByEmail(
            email,
          );

        if (user) {
          if (!user.googleId) {
            await userRepository.linkGoogleAccount(
              user.id,
              googleId,
            );

            user =
              await userRepository.findByEmail(
                email,
              );
          }

          return done(
            null,
            user || undefined,
          );
        }

        user =
          await userRepository.createUser({
            name,

            email,

            passwordHash: null,

            provider: "google",

            googleId,
          });

        return done(
          null,
          user || undefined,
        );
      } catch (error) {
        done(error as Error);
      }
    },
  ),
);

export default passport;