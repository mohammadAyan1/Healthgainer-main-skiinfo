const express = require("express");
const axios = require("axios");
const routes = express.Router();

const url = "http://redirect.ds3.in/submitsms.jsp";

routes.post("/", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(405).json({
        status: false,
        message: "Number is Required",
        Data: null,
      });
    }

    

    const otpNumber = Math.floor(1000 + Math.random() * 9000);

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

    if (!response?.status == 200) {
      return res
        .status(401)
        .json({ status: false, message: "OTP Did not Generated", Data: null });
    }

    res.status(200).json({
      status: true,
      message: "OTP Generated Successfull",
      Data: otpNumber,
    });
  } catch (error) {
    
  }
});

routes.post("/resend", async (req, res) => {
  try {
    const { phone, OTPNumber } = req.body;
    

    if (!phone) {
      res.status(405).json({
        status: false,
        message: "Number is Required",
        Data: null,
      });
    }
  

    const response = await axios.get(url, {
      params: {
        user: "FORTUNEINF",
        key: "ec48a1fc79XX",
        mobile: `+91${phone}`,
        message: `Your OTP is ${OTPNumber} for login to healthgainer.in By Pharma science The Indian Ayurveda. Valid for 10 minutes. Do not share this code with anyone.`,
        senderid: "PSAYUR",
        accusage: "1",
        entityid: "1201160222472542813",
        tempid: "1707175810749668953",
      },
    });

    if (!response?.status == 200) {
      return res
        .status(401)
        .json({ status: false, message: "OTP Did not Generated", Data: null });
    }

    res.status(200).json({
      status: true,
      message: "OTP Generated Successfull",
      Data: OTPNumber,
    });
  } catch (error) {
    
  }
});

module.exports = routes;
