import bcrypt from "bcrypt";
import { createUser, authenticateUser, getAllUsers } from "../models/users.js";
import { getProjectsForVolunteer } from "../models/volunteers.js";

const showUserRegistrationForm = (req, res) => {
  res.render("register", { title: "Register" });
};

const processUserRegistrationForm = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // Create the user in the database
    await createUser(name, email, passwordHash);
    // Redirect to the login page after successful registration
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    // 23505 is the Postgres unique-violation code (the email is already taken)
    if (error.code === "23505") {
      req.flash("error", "An account with that email already exists.");
    } else {
      req.flash(
        "error",
        "An error occurred during registration. Please try again.",
      );
    }
    res.redirect("/register");
  }
};

const showLoginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    if (user) {
      // Store user info in session
      req.session.user = user;
      req.flash("success", "Login successful!");
      if (res.locals.NODE_ENV === "development") {
        console.log("User logged in:", user);
      }
      res.redirect("/dashboard");
    } else {
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/login");
  }
};

const processLogout = async (req, res) => {
  if (req.session.user) {
    delete req.session.user;
  }
  req.flash("success", "Logout successful!");
  res.redirect("/login");
};

const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to access that page.");
    return res.redirect("/login");
  }
  next();
};

// Returns middleware that only lets users with the given role continue.
const requireRole = (roleName) => {
  return (req, res, next) => {
    const user = req.session && req.session.user;

    if (!user) {
      req.flash("error", "You must be logged in to access that page.");
      return res.redirect("/login");
    }

    if (user.role_name !== roleName) {
      req.flash("error", "You do not have permission to access that page.");
      return res.redirect("/dashboard");
    }

    next();
  };
};

const showDashboard = async (req, res) => {
  const user = req.session.user;
  // The projects this user has signed up to volunteer for.
  const volunteerProjects = await getProjectsForVolunteer(user.user_id);
  res.render("dashboard", {
    title: "Dashboard",
    name: user.name,
    email: user.email,
    role: user.role_name,
    volunteerProjects,
  });
};

const showUserPage = async (req, res) => {
  const users = await getAllUsers();
  const title = "Registered Users";
  res.render("users", { title, users });
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLogout,
  processLoginForm,
  requireLogin,
  requireRole,
  showDashboard,
  showUserPage,
};
