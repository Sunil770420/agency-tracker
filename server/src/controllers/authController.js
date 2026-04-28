import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, team, designation } = req.body;

    if (!name || !email || !password || !role || !team || !designation) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      team,
      designation: designation.trim()
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        team: user.team,
        designation: user.designation,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('REGISTER ERROR FULL:', error);
    return res.status(500).json({
      message: error.message || 'Server error while adding member'
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          team: user.team,
          designation: user.designation,
          profilePic: user.profilePic
        }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('LOGIN ERROR FULL:', error);
    return res.status(500).json({ message: 'Server error while login' });
  }
};