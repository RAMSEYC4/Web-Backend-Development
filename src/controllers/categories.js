import { body, validationResult } from "express-validator";

import {
  getAllCategories,
  getCategoryById,
  getCategoriesForProject,
  createCategory,
  updateCategory,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectsForCategory, getProjectById } from "../models/projects.js";

const categoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Project Categories";
  res.render("categories", { title, categories });
};

const categoryDetailsPage = async (req, res, next) => {
  const id = req.params.id;
  const category = await getCategoryById(id);

  // If no category was found, show a 404 page.
  if (!category) {
    const err = new Error("Category Not Found");
    err.status = 404;
    return next(err);
  }

  const projects = await getProjectsForCategory(id);
  const title = category.name;
  res.render("category-details", { title, category, projects });
};

// Define validation rules for the category forms.
const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters"),
];

const showNewCategoryForm = async (req, res) => {
  const title = "Add New Category";
  res.render("new-category", { title });
};

const processNewCategoryForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // Redirect back to the new category form
    return res.redirect("/new-category");
  }

  const { name } = req.body;
  const categoryId = await createCategory(name);

  req.flash("success", "Category added successfully!");
  res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res, next) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryById(categoryId);

  // If no category was found, show a 404 page.
  if (!categoryDetails) {
    const err = new Error("Category Not Found");
    err.status = 404;
    return next(err);
  }

  const title = "Edit Category";
  res.render("edit-category", { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;

  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    // Redirect back to the edit category form
    return res.redirect(`/edit-category/${categoryId}`);
  }

  const { name } = req.body;
  await updateCategory(categoryId, name);

  req.flash("success", "Category updated successfully!");
  res.redirect(`/category/${categoryId}`);
};

// Show the form used to assign categories to a service project.
const showAssignCategoriesForm = async (req, res, next) => {
  const projectId = req.params.projectId;
  const project = await getProjectById(projectId);

  // If no project was found, show a 404 page.
  if (!project) {
    const err = new Error("Project Not Found");
    err.status = 404;
    return next(err);
  }

  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesForProject(projectId);
  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    projectId,
    project,
    categories,
    assignedCategories,
  });
};

// Process the assign categories form submission.
const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  // A single checked box arrives as a string, so normalize to an array.
  const categoryIds = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];

  await updateCategoryAssignments(projectId, categoryIds);

  req.flash("success", "Categories updated successfully!");
  res.redirect(`/project/${projectId}`);
};

export {
  categoriesPage,
  categoryDetailsPage,
  categoryValidation,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
