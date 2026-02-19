
//controller is the actual business logic contains

const loginUser = (req, res) => {
  res.json({ message: "User logged in" });
};

module.exports = { loginUser };
