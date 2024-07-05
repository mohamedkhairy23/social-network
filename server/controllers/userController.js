// @desc     SignUp User
// @route    POST /api/users/signup
// @access   Public
exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    res.status(200).json({ name: name, email: email, password: password });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// @desc     SignIn User
// @route    POST /api/users/signin
// @access   Public
exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    res.status(200).json({ email: email, password: password });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
