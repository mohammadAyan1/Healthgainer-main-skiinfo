const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getAllUsers,
  todayLogins,
  changePassword,
  updateUserDetails,
  getOTP,
  getOTPLogin,
} = require("../controllers/authController");
const isAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();
// getOTP
router.post("/register", registerUser);
router.post("/getOTP", getOTP);
router.post("/getotplogin", getOTPLogin);
router.post("/login", loginUser);

router.post("/logout", isAuthenticated, logoutUser);
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);
router.get("/all", getAllUsers);
router.get("/todayLogins", todayLogins);
router.put("/changePassword", isAuthenticated, changePassword);
router.put("/updateDetails", isAuthenticated, updateUserDetails);

module.exports = router;
