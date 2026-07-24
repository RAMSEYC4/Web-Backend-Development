import { body, validationResult } from "express-validator";

import {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
} from "../models/organizations.js";
import { getProjectsForOrganization } from "../models/projects.js";

const organizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";
  res.render("organizations", { title, organizations });
};

const organizationDetailsPage = async (req, res, next) => {
  const id = req.params.id;
  const organization = await getOrganizationById(id);

  // If no organization was found, show a 404 page.
  if (!organization) {
    const err = new Error("Organization Not Found");
    err.status = 404;
    return next(err);
  }

  const projects = await getProjectsForOrganization(id);
  const title = organization.name;
  res.render("organization-details", { title, organization, projects });
};

const showNewOrganizationForm = async (req, res) => {
  const title = "Add New Organization";
  res.render("new-organization", { title });
};

const processNewOrganizationForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // Redirect back to the new organization form
    return res.redirect("/new-organization");
  }
  const { name, description, contactEmail } = req.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations
  const organizationId = await createOrganization(
    name,
    description,
    contactEmail,
    logoFilename,
  );
  req.flash("success", "Organization added successfully!");
  res.redirect(`/organization/${organizationId}`);
};

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required")
    .isLength({ max: 500 })
    .withMessage("Organization description cannot exceed 500 characters"),
  body("contactEmail")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
];

const showEditOrganizationForm = async (req, res, next) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationById(organizationId);

  // If no organization was found, show a 404 page.
  if (!organizationDetails) {
    const err = new Error("Organization Not Found");
    err.status = 404;
    return next(err);
  }

  const title = "Edit Organization";
  res.render("edit-organization", { title, organizationDetails });
};

const processEditOrganizationForm = async (req, res) => {
  const organizationId = req.params.id;

  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // Redirect back to the edit organization form
    return res.redirect(`/edit-organization/${organizationId}`);
  }

  const { name, description, contactEmail, logoFilename } = req.body;
  await updateOrganization(
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename,
  );

  req.flash("success", "Organization updated successfully!");
  res.redirect(`/organization/${organizationId}`);
};

export {
  organizationsPage,
  organizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
};
