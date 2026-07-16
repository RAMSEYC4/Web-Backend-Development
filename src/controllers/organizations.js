import { getAllOrganizations } from "../models/organizations.js";

const organizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";
  res.render("organizations", { title, organizations });
};

export { organizationsPage };
