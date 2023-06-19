const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
});

userSchema.methods.Messagesave = async function (message) {
  try {
    // this.messages = this.messages.concat({ message });
    this.messages = message;
    await this.save();
    return message;
  } catch (error) {
    console.log(error);
  }
};

const users = new mongoose.model("User", userSchema);

module.exports = users;
