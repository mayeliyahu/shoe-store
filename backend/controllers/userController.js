const User = require("../models/User");

exports.getUsers = async (req, res) => {
  const { name, email, password, isAdmin } = req.query;

  // Build the filter object dynamically
  const filter = {};

  if (name) filter.name = name;
  if (email) filter.email = email;
  if (password) filter.password = password;
  filter.isAdmin = isAdmin ? isAdmin === "true" : false;

  try {
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  try {
    const newUser = new User({ name, email, password, isAdmin });
    const user = await newUser.save();
    console.log("hereeee");
    console.log({ user });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  filter = { email: email, password: password };
  try {
    if (!email || !password) throw new Error("insert email and pswword");

    const users = await User.find(filter);
    if (users.length == 0)
      res.status(404).json({ error: "email or password are incorrect" });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
