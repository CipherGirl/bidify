import jwt from 'jsonwebtoken';

import { User } from '../models/users.model.js';

class TokenGenerator {
  // Generate Access Token
  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        type: 'ACCESS',
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );
  }

  // Generate Refresh Token
  static generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        type: 'REFRESH',
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );
  }

  // Verify Access Token
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Verify Refresh Token
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Token Refresh Endpoint Logic
  static async refreshAccessToken(refreshToken) {
    // Verify refresh token
    const decoded = this.verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    // Find user and generate new tokens
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }
}

export default TokenGenerator;
