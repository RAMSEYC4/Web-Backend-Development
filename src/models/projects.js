import db from "./db.js";

// Retrieve the next five upcoming service projects along with their
// partner organization.
const getAllProjects = async () => {
  const query = `
      SELECT service_project.id,
             service_project.name,
             service_project.description,
             service_project.event_date,
             organization.id AS organization_id,
             organization.name AS organization_name
      FROM public.service_project
      JOIN public.organization
        ON service_project.organization_id = organization.id
      WHERE service_project.event_date >= CURRENT_DATE
      ORDER BY service_project.event_date
      LIMIT 5;
    `;

  const result = await db.query(query);

  return result.rows;
};

// Retrieve a single service project by its ID, including its partner organization.
const getProjectById = async (id) => {
  const query = `
      SELECT service_project.id,
             service_project.name,
             service_project.description,
             service_project.event_date,
             organization.id AS organization_id,
             organization.name AS organization_name
      FROM public.service_project
      JOIN public.organization
        ON service_project.organization_id = organization.id
      WHERE service_project.id = $1;
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

// Retrieve all service projects for a given organization.
const getProjectsForOrganization = async (organizationId) => {
  const query = `
      SELECT id, name, description, event_date
      FROM public.service_project
      WHERE organization_id = $1
      ORDER BY event_date;
    `;

  const result = await db.query(query, [organizationId]);

  return result.rows;
};

/**
 * Creates a new service project in the database.
 * @param {string} name - The name of the project.
 * @param {string} description - A description of the project.
 * @param {string} eventDate - The scheduled date of the project (YYYY-MM-DD).
 * @param {string} organizationId - The id of the partner organization.
 * @returns {string} The id of the newly created project record.
 */
const createProject = async (name, description, eventDate, organizationId) => {
  const query = `
      INSERT INTO service_project (name, description, event_date, organization_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

  const queryParams = [name, description, eventDate, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].id);
  }

  return result.rows[0].id;
};

/**
 * Updates an existing service project in the database.
 * @param {string} id - The id of the project to update.
 * @param {string} name - The name of the project.
 * @param {string} description - A description of the project.
 * @param {string} eventDate - The scheduled date of the project (YYYY-MM-DD).
 * @param {string} organizationId - The id of the partner organization.
 * @returns {string} The id of the updated project record.
 */
const updateProject = async (
  id,
  name,
  description,
  eventDate,
  organizationId,
) => {
  const query = `
      UPDATE service_project
      SET name = $1, description = $2, event_date = $3, organization_id = $4
      WHERE id = $5
      RETURNING id
    `;

  const queryParams = [name, description, eventDate, organizationId, id];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Project not found");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated project with ID:", result.rows[0].id);
  }

  return result.rows[0].id;
};

export {
  getAllProjects,
  getProjectById,
  getProjectsForCategory,
  getProjectsForOrganization,
  createProject,
  updateProject,
};
