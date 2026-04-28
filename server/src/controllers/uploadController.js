import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      'base64'
    )}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'agency-tracker/profiles',
      resource_type: 'image'
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    ).select('-password');

    return res.json({
      message: 'Profile image uploaded successfully',
      profilePic: result.secure_url,
      user
    });
  } catch (error) {
    console.error('UPLOAD PROFILE ERROR:', error);
    return res.status(500).json({
      message: error.message || 'Image upload failed'
    });
  }
};