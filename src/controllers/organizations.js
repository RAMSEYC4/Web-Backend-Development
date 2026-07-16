import {
  getAllOrganizations,
  getOrganizationById,
} from "../models/organizations.js";
import { getProjectsForOrganization } from "../models/projects.js";

const organizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";
  res.render("organizations", { title, organizations });
};

const organizationDetailsPage = async (req, res, next) => {
  const id = req.params.id;
  const organization = await getOrganizationById(id);

  // If no organization was found, show a 404 page.
  if (!organization) {
    const err = new Error("Organization Not Found");
    err.status = 404;
    return next(err);
  }

  const projects = await getProjectsForOrganization(id);
  const title = organization.name;
  res.render("organization-details", { title, organization, projects });
};

export { organizationsPage, organizationDetailsPage };
