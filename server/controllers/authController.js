
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");

const axios = require("axios");

const isProd = process.env.NODE_ENV === "production";
console.log(false);


const app = express();

// get OTP after User validation
exports.getOTP = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, email, password } = req.body;

    if ( !mobileNumber) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // check for existing user with either email or mobileNumber
    const userExists = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    // console.log(userExists);

    if (userExists) {
      if (userExists.email === email) {
        return res
          .status(400)
          .json({ message: "This Email already exists", success: false });
      }
      if (userExists.mobileNumber === mobileNumber) {
        return res.status(400).json({
          message: "This Mobile Number already exists",
          success: false,
        });
      }
    }

    // Generate OTP
    const otpNumber = Math.floor(1000 + Math.random() * 9000);

    const url = "http://redirect.ds3.in/submitsms.jsp";

    const response = await axios.get(url, {
      params: {
        user: "FORTUNEINF",
        key: "ec48a1fc79XX",
        mobile: `+91${mobileNumber}`,
        message: `Your OTP is ${otpNumber} for login to healthgainer.in By Pharma science The Indian Ayurveda. Valid for 10 minutes. Do not share this code with anyone.`,
        senderid: "PSAYUR",
        accusage: "1",
        entityid: "1201160222472542813",
        tempid: "1707175810749668953",
      },
    });

    if (response?.status !== 200) {
      return res
        .status(401)
        .json({ success: false, message: "OTP not generated", Data: null });
    }

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      Data: otpNumber,
    });
  } catch (error) {
    console.error("Error in getOTP:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// register user after Check OTP
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, email, password } = req.body;

    // console.log(req.body, "HEELOREgister");

    if (!mobileNumber) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // check for existing user with either email or mobileNumber
    const userExists = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    // console.log(userExists);

    if (userExists) {
      if (userExists.email === email) {
        return res
          .status(400)
          .json({ message: "This Email already exists", success: false });
      }
      if (userExists.mobileNumber === mobileNumber) {
        return res.status(400).json({
          message: "This Mobile Number already exists",
          success: false,
        });
      }
    }

    const profilePhoto = `https://avatar.iran.liara.run/public/boy?email=${email}`;

    const newUser = await User.create({
      firstName,
      lastName,
      mobileNumber,
      email,
      // password: hashedPassword,
      profilePhoto,
      lastLogin: new Date(),
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    

    // ✅ Cookies (env-aware)
    const cookieExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const commonCookie = {
      path: "/",
      expires: cookieExpires,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    };

    res.cookie("token", token, { ...commonCookie, httpOnly: true });
    res.cookie("role", newUser.role, { ...commonCookie });

    // console.log("Cookies Set:", { token, role: newUser.role }); // Debugging log

    res.status(201).json({
      message: "User Registered Successfully",
      success: true,
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error); // Debugging log
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getOTPLogin = async (req, res) => {
  try {
    // console.log(req.body);

    const { phone } = req.body;
    if (!phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ mobileNumber: phone });
    if (!user)
      return res
        .status(400)
        .json({
          success: false,
          message: "User not registered with this number",
        });

    const otpNumber = Math.floor(1000 + Math.random() * 9000);

    const url = "http://redirect.ds3.in/submitsms.jsp";

    const response = await axios.get(url, {
      params: {
        user: "FORTUNEINF",
        key: "ec48a1fc79XX",
        mobile: `+91${phone}`,
        message: `Your OTP is ${otpNumber} for login to healthgainer.in By Pharma science The Indian Ayurveda. Valid for 10 minutes. Do not share this code with anyone.`,
        senderid: "PSAYUR",
        accusage: "1",
        entityid: "1201160222472542813",
        tempid: "1707175810749668953",
      },
    });

    if (response?.status !== 200) {
      return res
        .status(401)
        .json({ success: false, message: "OTP not generated", Data: null });
    }

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      Data: otpNumber,
    });
  } catch (error) {
    console.error("Error in loginUser:", error); // Debugging log
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    

    const { phone } = req.body.loginForm;
    if (!phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ mobileNumber: phone });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    

    // ✅ Cookies (env-aware)
    const cookieExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const commonCookie = {
      path: "/",
      expires: cookieExpires,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    };

    res.cookie("token", token, { ...commonCookie, httpOnly: true });
    res.cookie("role", user.role, { ...commonCookie });

    

    res.status(200).json({
      message: "Login Successful",
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error); // Debugging log
    res.status(500).json({ message: error.message });
  }
};

// Logout User
exports.logoutUser = async (req, res) => {
  try {
    const clearCookie = {
      expires: new Date(0),
      path: "/",
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    };

    res.cookie("token", "", { ...clearCookie, httpOnly: true });
    res.cookie("role", "", { ...clearCookie });

    res.status(200).json({ message: "Logout Successful", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id, role } = req.body;
    // console.log(id, role);

    const userId = id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role || user.role;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.id;
    // console.log(userId);

    await User.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ message: "User deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  const id = req.id;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json({ users, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.todayLogins = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({ lastLogin: { $gte: today } }).select(
      "-password"
    ); // Exclude passwords
    res.status(200).json({ users, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const id = req.id;
    

    const { newPassword, oldPassword } = req.body;
    
    const currentPassword = oldPassword;
    const password = newPassword;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare the provided current password with the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ message: "Password changed successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const id = req.id;
    const { email, firstName, lastName, mobileNumber, role } = req.body;
    

    const userId = id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists)
        return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.email = email || user.email;
    // user.role = role || user.role;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
