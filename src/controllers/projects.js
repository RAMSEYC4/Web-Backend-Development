import { getAllProjects, getProjectById } from "../models/projects.js";
import { getCategoriesForProject } from "../models/categories.js";

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

export { projectsPage, projectDetailsPage };
