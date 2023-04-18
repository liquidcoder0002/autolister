import mongoose from 'mongoose';

//Define schema for Warranty feature
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: { currentTime: () => new Date().getTime() } }
);

const User = mongoose.model('adminUsers', userSchema);

export default User;
