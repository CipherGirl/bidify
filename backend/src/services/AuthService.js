import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserRepository from '../repositories/UserRepository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../utils/httpStatus.js';

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data) {
    const { fullName, email, password } = data;

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.userRepository.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(data) {
    const { email, password } = data;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.password) {
      throw new Error('Password field is missing for the user');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Proceed with login logic

    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '1d',
    });

    return token;
  }
}

export default AuthService;
