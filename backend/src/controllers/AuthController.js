import AuthService from '../services/AuthService.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import HTTP_STATUS from '../utils/httpStatus.js';

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!email || !password || !fullName) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'All fields are required: email, password, fullName');
    }

    const user = await this.authService.register({ email, password, fullName });

    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.CREATED, user, 'User registered successfully'));
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Both email and password are required');
    }

    const token = await this.authService.login({ email, password });
    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        {
          tokens: token,
        },
        'Login successfull'
      )
    );
  });
}

export default new AuthController();
