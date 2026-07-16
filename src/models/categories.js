import db from "./db.js";

const getAllCategories = async () => {
  const query = `
      SELECT id, name
      FROM public.category;
    `;

  const result = await db.query(query);

  return result.rows;
};

// Retrieve a single category by its ID.
const getCategoryById = async (id) => {
  const query = `
      SELECT id, name
      FROM public.category
      WHERE id = $1;
    `;

  const result = await db.query(query, [id]);

  return result.rows[0];
};

// Retrieve all categories for a given service project.
const getCategoriesForProject = async (projectId) => {
  const query = `
      SELECT category.id, category.name
      FROM public.category
      JOIN public.project_category
        ON category.id = project_category.category_id
      WHERE project_category.project_id = $1;
    `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};

export { getAllCategories, getCategoryById, getCategoriesForProject };
