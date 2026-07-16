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

export { getAllOrganizations, getOrganizationById };
