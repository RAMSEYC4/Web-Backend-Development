import { addVolunteer, removeVolunteer } from "../models/volunteers.js";
import { getProjectById } from "../models/projects.js";

/**
 * Works out where to send the user after they sign up or withdraw.
 * Only the two known pages are accepted so the value coming from the form
 * can never be used to redirect somewhere unexpected.
 */
const redirectTarget = (req, projectId) => {
  return req.body?.returnTo === "dashboard"
    ? "/dashboard"
    : `/project/${projectId}`;
};

const processVolunteerSignup = async (req, res, next) => {
  const projectId = req.params.projectId;
  const userId = req.session.user.user_id;

  const project = await getProjectById(projectId);
  // If no project was found, show a 404 page.
  if (!project) {
    const err = new Error("Project Not Found");
    err.status = 404;
    return next(err);
  }

  try {
    await addVolunteer(userId, projectId);
    req.flash("success", `Thank you for volunteering for ${project.name}!`);
  } catch (error) {
    console.error("Error adding volunteer:", error);
    req.flash("error", "There was an error signing you up for that project.");
  }

  res.redirect(redirectTarget(req, projectId));
};

const processVolunteerRemoval = async (req, res, next) => {
  const projectId = req.params.projectId;
  const userId = req.session.user.user_id;

  const project = await getProjectById(projectId);
  // If no project was found, show a 404 page.
  if (!project) {
    const err = new Error("Project Not Found");
    err.status = 404;
    return next(err);
  }

  try {
    await removeVolunteer(userId, projectId);
    req.flash(
      "success",
      `You are no longer volunteering for ${project.name}.`,
    );
  } catch (error) {
    console.error("Error removing volunteer:", error);
    req.flash("error", "There was an error removing you from that project.");
  }

  res.redirect(redirectTarget(req, projectId));
};

export { processVolunteerSignup, processVolunteerRemoval };
