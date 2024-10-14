// userController.js

const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, username, password } = req.body;

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

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).send("Error updating profile: " + error.message);
  }
};

module.exports = { updateUserProfile };
