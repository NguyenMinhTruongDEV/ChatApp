import bcrypt from 'bcrypt';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/session.model.js';

const ACCESS_TOKEN_TTL = '30m'; // thường là dưới 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // thường là trên 14

// [POST] /api/auth/signup
export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message: 'Không thể thiếu username, password, email, firstName hoặc lastName'
      });
    }

    // Kiểm tra xem username đã tồn tại chưa
    const duplicate = await User.findOne({ username });

    if (duplicate) {
      return res.status(409).json({ message: 'Username đã tồn tại' });
    }

    // Mã hóa Password
    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

    // Tạo user mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`
    });

    // Trả về phản hồi thành công
    return res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Lỗi khi gọi signup:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

// [POST] /api/auth/signin
export const signIn = async (req, res) => {
  try {
    // Lấy Inputs
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Thiếu username hoặc password' });
    }

    // Lấy HashPassword trong DB để so sánh với password input
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Username hoặc password không chính xác' });
    }

    // Kiểm tra password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res.status(401).json({ message: 'Username hoặc password không chính xác' });
    }

    // nếu khớp tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // Tạo refresh Token với JWT
    const refreshToken = crypto.randomBytes(64).toString('hex');

    // tạo session mới để lưu refreshToken vào DB
    await Session.create({
      userId: user._id,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
    });

    // trả refreshToken về trong cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // chỉ gửi cookie qua HTTPS trong production
      sameSite: 'none', // backend và frontend khác domain nên cần set sameSite: 'none' và secure: true
      maxAge: REFRESH_TOKEN_TTL
    });

    // trả accessToken về trong res
    return res.status(200).json({ message: `User ${user.displayName} đã logged in thành công`, accessToken });

  } catch (error) {
    console.error('Lỗi khi gọi signin:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

// [POST] /api/auth/signout
export const signOut = async (req, res) => {
  try {
    // Lấy refreshToken từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // Xóa refreshToken trong Session DB
      await Session.deleteOne({ refreshToken: token });

      // Xóa cookie refreshToken
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
    }
    return res.status(204).json({ message: 'User đã logged out thành công' });
  } catch (error) {
    console.error('Lỗi khi gọi signout:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

// [POST] /api/auth/refresh
// Tạo accessToken mới từ refreshToken
export const refreshToken = async (req, res) => {
  try {
    // lấy refreshToken từ cookie
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Token không tồn tại.' });
    }

    // so với refreshToken trong DB
    const session = await Session.findOne({ refreshToken: token });

    if(!session) {
      return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }

    // kiểm tra hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: 'Token đã hết hạn.' });
    }

    // tạo accessToken mới
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // return accessToken mới
    return res.status(200).json({ accessToken }); 
  } catch (error) {
    console.error('Lỗi khi gọi refreshToken:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};
