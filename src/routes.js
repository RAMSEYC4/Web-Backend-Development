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

const router = express.Router();

router.get("/", index);
router.get("/organizations", organizationsPage);
router.get("/organization/:id", organizationDetailsPage);
router.get("/projects", projectsPage);
router.get("/project/:id", projectDetailsPage);
router.get("/categories", categoriesPage);
router.get("/category/:id", categoryDetailsPage);
router.get("/new-organization", showNewOrganizationForm);
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm,
);

// error-handling routes
router.get("/test-error", testErrorPage);
router.get("/edit-organization/:id", showEditOrganizationForm);
router.post(
  "/edit-organization/:id",
  organizationValidation,
  processEditOrganizationForm,
);
// Route for new project page
router.get("/new-project", showNewProjectForm);
// Route to handle new project form submission
router.post("/new-project", projectValidation, processNewProjectForm);

// Route for edit project page
router.get("/edit-project/:id", showEditProjectForm);
// Route to handle edit project form submission
router.post("/edit-project/:id", projectValidation, processEditProjectForm);

// Route for new category page
router.get("/new-category", showNewCategoryForm);
// Route to handle new category form submission
router.post("/new-category", categoryValidation, processNewCategoryForm);

// Route for edit category page
router.get("/edit-category/:id", showEditCategoryForm);
// Route to handle edit category form submission
router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);

// Routes to handle the assign categories to project form
router.get("/assign-categories/:projectId", showAssignCategoriesForm);
router.post("/assign-categories/:projectId", processAssignCategoriesForm);

export default router;
