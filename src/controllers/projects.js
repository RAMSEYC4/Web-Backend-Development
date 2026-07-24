import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
} from "../models/projects.js";
import { getCategoriesForProject } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";

import { body, validationResult } from "express-validator";

// Define validation rules for the service project forms.
const projectValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Project name must be between 3 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("eventDate")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date format"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
];

const projectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = "Upcoming Service Projects";
  res.render("projects", { title, projects });
};

const projectDetailsPage = async (req, res, next) => {
  const id = req.params.id;
  const project = await getProjectById(id);
  // If no project was found, show a 404 page.
  if (!project) {
    const err = new Error("Project Not Found");
    err.status = 404;
    return next(err);
  }
  const categories = await getCategoriesForProject(id);
  const title = project.name;
  res.render("project-details", { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Add New Service Project";
  res.render("new-project", { title, organizations });
};

const processNewProjectForm = async (req, res) => {
  // Extract form data from req.body
  const { name, description, eventDate, organizationId } = req.body;
  try {
    // Create the new project in the database
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Loop through validation errors and flash them
      errors.array().forEach((error) => {
        req.flash("error", error.msg);
      });
      // Redirect back to the new project form
      return res.redirect("/new-project");
    }
    await createProject(name, description, eventDate, organizationId);
    req.flash("success", "New service project created successfully!");
    res.redirect("/projects");
  } catch (error) {
    console.error("Error creating new project:", error);
    req.flash("error", "There was an error creating the service project.");
    res.redirect("/new-project");
  }
};

const showEditProjectForm = async (req, res, next) => {
  const projectId = req.params.id;
  const projectDetails = await getProjectById(projectId);

  // If no project was found, show a 404 page.
  if (!projectDetails) {
    const err = new Error("Project Not Found");
    err.status = 404;
    return next(err);
  }

  const organizations = await getAllOrganizations();
  const title = "Edit Service Project";
  res.render("edit-project", { title, projectDetails, organizations });
};

const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Loop through validation errors and flash them
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // Redirect back to the edit project form
    return res.redirect(`/edit-project/${projectId}`);
  }

  const { name, description, eventDate, organizationId } = req.body;
  await updateProject(projectId, name, description, eventDate, organizationId);

  req.flash("success", "Service project updated successfully!");
  res.redirect(`/project/${projectId}`);
};

export {
  projectsPage,
  projectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
};
