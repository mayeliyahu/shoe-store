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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
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

exports.deleteUser = async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted' });
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

exports.getUserReports = async (req, res) => {
  try {
      const users = await User.aggregate([
          {
              $group: {
                  _id: {
                      year: { $year: "$createdAt" },
                      month: { $month: "$createdAt" }
                  }, // Group by year and month
                  count: { $sum: 1 } // Count the number of users registered in that month
              }
          },
      ]);
      console.log({...users});
      res.json(users);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
