import { getAllCategories, getCategoryById } from "../models/categories.js";
import { getProjectsForCategory } from "../models/projects.js";

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

export { categoriesPage, categoryDetailsPage };
