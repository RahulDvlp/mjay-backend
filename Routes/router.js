const express = require("express");
const router = express.Router();
const users = require("../models/userSchema");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

router.post("/register", async (req, res) => {
  const { name, email, phone, service } = req.body;

  if (!name || !email || !phone || !service) {
    return res.status(401).json({ status: 401, error: "All input required" });
  }

  try {
    const preUser = await users.findOne({ email: email });

    if (preUser) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: "patothanos6@gmail.com",
        subject: "New Contact Form Submission",
        text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return res
        .status(201)
        .json({ status: 201, message: "Email sent successfully" });
    } else {
      const finalUser = new users({
        name,
        email,
        phone,
        service,
      });

      const storeData = await finalUser.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: "patothanos6@gmail.com",
        subject: "New Contact Form Submission",
        text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);

      return res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    console.log("Error occurred:", error);
    return res.status(500).json({ status: 500, error: "An error occurred" });
  }
});

module.exports = router;
