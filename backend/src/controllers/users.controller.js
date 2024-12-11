import { User } from '../models/users.model.js';
import usersService from '../services/users.service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, 'User with username or email already exists');
  }

  const user = await usersService.createUser({ username, email, password });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { user: { username: user.username, email: user.email } }, 'User registered successfully')
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

  const token = user.generateAuthToken();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { token, user: { username: user.username, email: user.email } },
        'User logged in successfully'
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, 'User details retrieved successfully'));
});

export default {
  createUser,
  loginUser,
  getCurrentUser,
};
