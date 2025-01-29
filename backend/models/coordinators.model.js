import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const coordinatorSchema = new mongoose.Schema(
  {
    coordinatorID: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    coordinatorName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    assignedBatch: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

coordinatorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

coordinatorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      // payload
      _id: this._id,
      email: this.email,
      coordinatorName: this.coordinatorName,
    }, // secret key
    process.env.ACCESS_TOKEN_SECRET,
    {
      // token expiry time
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

coordinatorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      // payload
      _id: this._id,
    }, // secret key
    process.env.REFRESH_TOKEN_SECRET,
    {
      // token expiry time
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

coordinatorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const Coordinator = mongoose.model("Coordinator", coordinatorSchema);
