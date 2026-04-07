import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  avatarUrl: {
    type: String, // link URL để hiển thị hình
  },
  avatarId: {
    type: String, // Cloudinary public_id để xóa ảnh
  },
  bio: {
    type: String,
    maxLength: 500 // tùy chỉnh giới hạn độ dài bio
  },
  phone: {
    type: String,
    sparse: true, // cho phép null hoặc không tồn tại, nhưng không được trùng
  }
}, {
  timestamps: true
});

// ✅ FIX
const User = mongoose.models.User || mongoose.model("User", userSchema, "users");

export default User;