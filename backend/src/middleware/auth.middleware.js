import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { User } from '../models/users.model.js';

// jwtOptions for access token
const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_SECRET,
};

// jwtOptions for refresh token
const refreshTokenOptions = {
  jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'), // Example: refresh token from body
  secretOrKey: process.env.JWT_REFRESH_SECRET,
};

// Access Token Strategy
passport.use(
  'jwt-access',
  new JwtStrategy(accessTokenOptions, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id).select('-password');
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Refresh Token Strategy
passport.use(
  'jwt-refresh',
  new JwtStrategy(refreshTokenOptions, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id).select('-password');
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export const isAuthenticated = (req, res, next) => {
  passport.authenticate('jwt-access', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired access token',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const validateRefreshToken = (req, res, next) => {
  passport.authenticate('jwt-refresh', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired refresh token',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default passport;
