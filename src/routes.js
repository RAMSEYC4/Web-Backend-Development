import express from "express";

import { index } from "./controllers/index.js";
import {
  organizationsPage,
  organizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";
import {
  projectsPage,
  projectDetailsPage,
  processNewProjectForm,
  showNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
} from "./controllers/projects.js";
import {
  categoriesPage,
  categoryDetailsPage,
  categoryValidation,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";
import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUserPage,
} from "./controllers/users.js";
import {
  processVolunteerSignup,
  processVolunteerRemoval,
} from "./controllers/volunteers.js";

const router = express.Router();

// Only a logged-in administrator may add, edit or assign content. Every
// route below that changes data is guarded with this pair of middleware,
// so the protection cannot be bypassed by typing the URL directly.
const adminOnly = [requireLogin, requireRole("admin")];

// Public read-only routes
router.get("/", index);
router.get("/organizations", organizationsPage);
router.get("/organization/:id", organizationDetailsPage);
router.get("/projects", projectsPage);
router.get("/project/:id", projectDetailsPage);
router.get("/categories", categoriesPage);
router.get("/category/:id", categoryDetailsPage);

// Route for new organization page - admins only
router.get("/new-organization", adminOnly, showNewOrganizationForm);
// Route to handle new organization form submission - admins only
router.post(
  "/new-organization",
  adminOnly,
  organizationValidation,
  processNewOrganizationForm,
);

// error-handling routes
router.get("/test-error", testErrorPage);

// Route for edit organization page - admins only
router.get("/edit-organization/:id", adminOnly, showEditOrganizationForm);
// Route to handle edit organization form submission - admins only
router.post(
  "/edit-organization/:id",
  adminOnly,
  organizationValidation,
  processEditOrganizationForm,
);

// Route for new project page - admins only
router.get("/new-project", adminOnly, showNewProjectForm);
// Route to handle new project form submission - admins only
router.post("/new-project", adminOnly, projectValidation, processNewProjectForm);

// Route for edit project page - admins only
router.get("/edit-project/:id", adminOnly, showEditProjectForm);
// Route to handle edit project form submission - admins only
router.post(
  "/edit-project/:id",
  adminOnly,
  projectValidation,
  processEditProjectForm,
);

// Route for new category page - admins only
router.get("/new-category", adminOnly, showNewCategoryForm);
// Route to handle new category form submission - admins only
router.post(
  "/new-category",
  adminOnly,
  categoryValidation,
  processNewCategoryForm,
);

// Route for edit category page - admins only
router.get("/edit-category/:id", adminOnly, showEditCategoryForm);
// Route to handle edit category form submission - admins only
router.post(
  "/edit-category/:id",
  adminOnly,
  categoryValidation,
  processEditCategoryForm,
);

// Routes to handle the assign categories to project form - admins only
router.get("/assign-categories/:projectId", adminOnly, showAssignCategoriesForm);
router.post(
  "/assign-categories/:projectId",
  adminOnly,
  processAssignCategoriesForm,
);

// User registration routes
router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

// User login routes
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);

// Protected dashboard route
router.get("/dashboard", requireLogin, showDashboard);

// Protected users route - admins only
router.get("/users", requireLogin, requireRole("admin"), showUserPage);

// Volunteer sign-up routes - logged-in users only. Both change data, so they
// are POST routes guarded by requireLogin and cannot be reached by simply
// typing a URL while logged out.
router.post("/volunteer/:projectId", requireLogin, processVolunteerSignup);
router.post(
  "/remove-volunteer/:projectId",
  requireLogin,
  processVolunteerRemoval,
);

export default router;
