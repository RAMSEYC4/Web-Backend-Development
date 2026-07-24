import db from "./db.js";

const getAllOrganizations = async () => {
  const query = `
        SELECT id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

  const result = await db.query(query);

  return result.rows;
};

// Retrieve a single organization by its ID.
const getOrganizationById = async (id) => {
  const query = `
      SELECT id, name, description, contact_email, logo_filename
      FROM public.organization
      WHERE id = $1;
    `;

  const result = await db.query(query, [id]);

  return result.rows[0];
};

/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */
const createOrganization = async (
  name,
  description,
  contactEmail,
  logoFilename,
) => {
  const query = `
      INSERT INTO organization (name, description, contact_email, logo_filename)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

  const queryParams = [name, description, contactEmail, logoFilename];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create organization");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new organization with ID:", result.rows[0].id);
  }

  return result.rows[0].id;
};

/**
 * Updates an existing organization in the database.
 * @param {string} id - The id of the organization to update.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the updated organization record.
 */
const updateOrganization = async (
  id,
  name,
  description,
  contactEmail,
  logoFilename,
) => {
  const query = `
      UPDATE organization
      SET name = $1, description = $2, contact_email = $3, logo_filename = $4
      WHERE id = $5
      RETURNING id
    `;

  const queryParams = [name, description, contactEmail, logoFilename, id];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Organization not found");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated organization with ID:", result.rows[0].id);
  }

  return result.rows[0].id;
};

export {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
};
