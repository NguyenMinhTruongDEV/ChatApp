import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Kết nối CSDL thành công");
  } catch (error) {
    console.error("Lỗi kết nối CSDL:", error);
    process.exit(1); // Thoát ứng dụng nếu không thể kết nối
  }
};