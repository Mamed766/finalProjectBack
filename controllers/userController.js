// userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, username, password, email } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
      process.env.JWTPRIVATEKEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Profile updated successfully", token });
  } catch (error) {
    res.status(500).send("Error updating profile: " + error.message);
  }
};

module.exports = { updateUserProfile };
