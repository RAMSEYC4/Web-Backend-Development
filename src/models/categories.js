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

/**
 * Creates a new category in the database.
 * @param {string} name - The name of the category.
 * @returns {string} The id of the newly created category record.
 */
const createCategory = async (name) => {
  const query = `
      INSERT INTO category (name)
      VALUES ($1)
      RETURNING id
    `;

  const result = await db.query(query, [name]);

  if (result.rows.length === 0) {
    throw new Error("Failed to create category");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new category with ID:", result.rows[0].id);
  }

  return result.rows[0].id;
};

/**
 * Updates an existing category in the database.
 * @param {string} id - The id of the category to update.
 * @param {string} name - The name of the category.
 * @returns {string} The id of the updated category record.
 */
const updateCategory = async (id, name) => {
  const query = `
      UPDATE category
      SET name = $1
      WHERE id = $2
      RETURNING id
    `;

  const result = await db.query(query, [name, id]);

  if (result.rows.length === 0) {
    throw new Error("Category not found");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated category with ID:", result.rows[0].id);
  }

  return result.rows[0].id;
};

// Assign a single category to a service project.
const assignCategoryToProject = async (categoryId, projectId) => {
  const query = `
      INSERT INTO public.project_category (category_id, project_id)
      VALUES ($1, $2);
    `;

  await db.query(query, [categoryId, projectId]);
};

// Replace all category assignments for a service project.
const updateCategoryAssignments = async (projectId, categoryIds) => {
  // First, remove existing category assignments for the project
  const deleteQuery = `
      DELETE FROM public.project_category
      WHERE project_id = $1;
    `;

  await db.query(deleteQuery, [projectId]);

  // Next, add the new category assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId);
  }
};

export {
  getAllCategories,
  getCategoryById,
  getCategoriesForProject,
  createCategory,
  updateCategory,
  updateCategoryAssignments,
};
