import db from "./db.js";

const getAllCategories = async () => {
  const query = `
      SELECT id, name
      FROM public.category;
    `;

  const result = await db.query(query);

  return result.rows;
};

export { getAllCategories };
