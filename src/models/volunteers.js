import db from "./db.js";

/**
 * Signs a user up as a volunteer for a service project.
 * A user can only volunteer once per project, so a repeated sign-up is
 * ignored rather than treated as an error.
 * @param {string} userId - The id of the user volunteering.
 * @param {string} projectId - The id of the service project.
 */
const addVolunteer = async (userId, projectId) => {
  const query = `
      INSERT INTO public.project_volunteer (user_id, project_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, project_id) DO NOTHING;
    `;

  await db.query(query, [userId, projectId]);

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Added volunteer", userId, "to project", projectId);
  }
};

/**
 * Removes a user as a volunteer from a service project.
 * @param {string} userId - The id of the user to remove.
 * @param {string} projectId - The id of the service project.
 */
const removeVolunteer = async (userId, projectId) => {
  const query = `
      DELETE FROM public.project_volunteer
      WHERE user_id = $1 AND project_id = $2;
    `;

  await db.query(query, [userId, projectId]);

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Removed volunteer", userId, "from project", projectId);
  }
};

/**
 * Retrieves every service project a user has volunteered for.
 * @param {string} userId - The id of the user.
 * @returns {Array} The projects the user is volunteering for.
 */
const getProjectsForVolunteer = async (userId) => {
  const query = `
      SELECT service_project.id,
             service_project.name,
             service_project.description,
             service_project.event_date,
             organization.id AS organization_id,
             organization.name AS organization_name
      FROM public.project_volunteer
      JOIN public.service_project
        ON project_volunteer.project_id = service_project.id
      JOIN public.organization
        ON service_project.organization_id = organization.id
      WHERE project_volunteer.user_id = $1
      ORDER BY service_project.event_date;
    `;

  const result = await db.query(query, [userId]);

  return result.rows;
};

/**
 * Checks whether a user has already volunteered for a service project.
 * @param {string} userId - The id of the user.
 * @param {string} projectId - The id of the service project.
 * @returns {boolean} True when the user is a volunteer for the project.
 */
const isUserVolunteer = async (userId, projectId) => {
  const query = `
      SELECT 1
      FROM public.project_volunteer
      WHERE user_id = $1 AND project_id = $2;
    `;

  const result = await db.query(query, [userId, projectId]);

  return result.rows.length > 0;
};

/**
 * Retrieves every user who has volunteered for a service project.
 * @param {string} projectId - The id of the service project.
 * @returns {Array} The users volunteering for the project.
 */
const getVolunteersForProject = async (projectId) => {
  const query = `
      SELECT users.user_id, users.name, users.email
      FROM public.project_volunteer
      JOIN public.users
        ON project_volunteer.user_id = users.user_id
      WHERE project_volunteer.project_id = $1
      ORDER BY users.name;
    `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};

export {
  addVolunteer,
  removeVolunteer,
  getProjectsForVolunteer,
  isUserVolunteer,
  getVolunteersForProject,
};
