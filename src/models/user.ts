import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  veryifyCodeExpiry: Date;
  isAcceptMessage: boolean;
  isVerified: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is ewquired"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please provide valid email",
    ],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "VerifyCode is required"],
  },

  veryifyCodeExpiry: {
    type: Date,
    reqwuired: [true, "verify code expiry is required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptMessage: {
    type: Boolean,
    default: true,
  },

  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
