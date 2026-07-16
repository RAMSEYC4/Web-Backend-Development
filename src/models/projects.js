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

export {
  getAllProjects,
  getProjectById,
  getProjectsForCategory,
  getProjectsForOrganization,
};
