const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to Home-Stay");
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginPage = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Home-Stay");
  console.log(res.locals.redirectUrl);
  res.redirect(res.locals.redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "you are logged out");
      res.redirect("/listings");
    }
  });
};
