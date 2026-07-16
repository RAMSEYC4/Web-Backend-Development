import db from "./db.js";

const getAllProjects = async () => {
  const query = `
      SELECT id, name, description
      FROM public.service_project;
    `;

  const result = await db.query(query);

  return result.rows;
};

// Retrieve a single service project by its ID.
const getProjectById = async (id) => {
  const query = `
      SELECT id, name, description
      FROM public.service_project
      WHERE id = $1;
    `;

  const result = await db.query(query, [id]);

  return result.rows[0];
};

// Retrieve all service projects for a given category.
const getProjectsForCategory = async (categoryId) => {
  const query = `
      SELECT service_project.id, service_project.name, service_project.description
      FROM public.service_project
      JOIN public.project_category
        ON service_project.id = project_category.project_id
      WHERE project_category.category_id = $1;
    `;

  const result = await db.query(query, [categoryId]);

  return result.rows;
};

export { getAllProjects, getProjectById, getProjectsForCategory };
