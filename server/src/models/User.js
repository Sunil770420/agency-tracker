import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee'
    },

    team: {
      type: String,
      enum: ['digital', 'development'],
      default: 'digital'
    },

    designation: {
      type: String,
      default: ''
    },

    // ✅ NEW FIELD (profile image)
    profilePic: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// password hash
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// password match
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;