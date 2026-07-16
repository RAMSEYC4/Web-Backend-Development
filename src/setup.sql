-- CREATE TABLE organization (
--   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   name VARCHAR(150) NOT NULL,
--   description TEXT NOT NULL,
--   contact_email VARCHAR(255) NOT NULL,
--   logo_filename VARCHAR(255) NOT NULL
-- );


SELECT * FROM organization

-- INSERT INTO organization (name, description, contact_email, logo_filename)
-- VALUES 
-- (
--   'BrightFuture Builders', 
--   'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 
--   'info@brightfuturebuilders.org', 
--   'brightfuture-logo.png'
-- ),
-- (
--   'GreenHarvest Growers', 
--   'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
--   'contact@greenharvest.org', 
--   'greenharvest-logo.png'
-- ),
-- (
--   'UnityServe Volunteers', 
--   'A volunteer coordination group supporting local charities and service initiatives.', 
--   'hello@unityserve.org', 
--   'unityserve-logo.png'
-- );

SELECT * FROM service_project 

-- Service projects that volunteers can join.
-- CREATE TABLE service_project (
--   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   name VARCHAR(150) NOT NULL,
--   description TEXT NOT NULL
-- );

-- INSERT INTO service_project (name, description)
-- VALUES
--   ('Park Cleanup', 'Join us to clean up local parks and make them beautiful!'),
--   ('Food Drive', 'Help collect and distribute food to those in need.'),
--   ('Community Tutoring', 'Volunteer to tutor students in various subjects.');

-- Each service project belongs to a partner organization and has a scheduled
-- date so the projects page can list the next upcoming events.
-- ALTER TABLE service_project
--   ADD COLUMN organization_id INT NOT NULL REFERENCES organization (id);
-- ALTER TABLE service_project
--   ADD COLUMN event_date DATE NOT NULL;

-- UPDATE service_project SET organization_id = 1, event_date = '2026-07-25' WHERE id = 1; -- Park Cleanup      -> BrightFuture Builders
-- UPDATE service_project SET organization_id = 3, event_date = '2026-08-05' WHERE id = 2; -- Food Drive        -> UnityServe Volunteers
-- UPDATE service_project SET organization_id = 2, event_date = '2026-08-20' WHERE id = 3; -- Community Tutoring -> GreenHarvest Growers

SELECT * FROM category

-- -- Categories a service project can be classified under.
-- CREATE TABLE category (
--   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   name VARCHAR(100) NOT NULL UNIQUE
-- );

-- INSERT INTO category (name)
-- VALUES
--   ('Environmental'),
--   ('Educational'),
--   ('Community Service'),
--   ('Health and Wellness');

-- -- Junction table: links projects and categories (many-to-many).
-- CREATE TABLE project_category (
--   project_id INT NOT NULL REFERENCES service_project (id),
--   category_id INT NOT NULL REFERENCES category (id),
--   PRIMARY KEY (project_id, category_id)
-- );

-- -- Associate each project with at least one category.
-- INSERT INTO project_category (project_id, category_id)
-- VALUES
--   (1, 1),  -- Park Cleanup       -> Environmental
--   (1, 3),  -- Park Cleanup       -> Community Service
--   (2, 3),  -- Food Drive         -> Community Service
--   (2, 4),  -- Food Drive         -> Health and Wellness
--   (3, 2);  -- Community Tutoring  -> Educational


