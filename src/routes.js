import express from "express";

import { index } from "./controllers/index.js";
import { organizationsPage } from "./controllers/organizations.js";
import { projectsPage, projectDetailsPage } from "./controllers/projects.js";
import { categoriesPage, categoryDetailsPage } from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", index);
router.get("/organizations", organizationsPage);
router.get("/projects", projectsPage);
router.get("/project/:id", projectDetailsPage);
router.get("/categories", categoriesPage);
router.get("/category/:id", categoryDetailsPage);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
