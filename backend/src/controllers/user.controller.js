// [GET] /api/users/me
export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    return res.status(200).json({
      statusCode: 200,
      message: "Hehe AuthMe",
      data: user
    });
  } catch (error) {
    console.error("Lỗi khi gọi AuthMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// [POST] /api/users/test
export const test = async (req, res) => {
  try {
    return res.status(204).json({
      statusCode: 200,
      message: "Hehe Test",
    });
  } catch (error) {
    console.error("Lỗi khi gọi Test", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};