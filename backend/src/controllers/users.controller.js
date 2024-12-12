import { User } from '../models/users.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import TokenGenerator from '../utils/TokenGenerator.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check existing user
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, 'User already exists');
  }

  // Create user
  const user = await User.create({ username, email, password });

  // Generate tokens
  const accessToken = TokenGenerator.generateAccessToken(user);
  const refreshToken = TokenGenerator.generateRefreshToken(user);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
      'User registered successfully'
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = TokenGenerator.generateRefreshToken(user);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
      'Login successful'
    )
  );
});

const refreshTokens = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const newTokens = await TokenGenerator.refreshAccessToken(refreshToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tokens: newTokens,
      },
      'Tokens refreshed successfully'
    )
  );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      'User fetched successfully'
    )
  );
});

export default {
  registerUser,
  loginUser,
  refreshTokens,
  getCurrentUser,
};
