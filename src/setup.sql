-- ORGANIZATION
CREATE TABLE organization (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES (
        'BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org',
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers',
        'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'unityserve-logo.png'
    );
-- SERVICE PROJECT
CREATE TABLE service_project (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    organization_id INT REFERENCES organization (id),
    event_date DATE
);
INSERT INTO service_project (name, description, organization_id, event_date)
VALUES (
        'Park Cleanup',
        'Join us to clean up local parks and make them beautiful!',
        1,
        '2026-07-25'
    ),
    (
        'Food Drive',
        'Help collect and distribute food to those in need.',
        3,
        '2026-08-05'
    ),
    (
        'Community Tutoring',
        'Volunteer to tutor students in various subjects.',
        2,
        '2026-08-20'
    );
-- now that every row has values, enforce NOT NULL
ALTER TABLE service_project
ALTER COLUMN organization_id
SET NOT NULL;
ALTER TABLE service_project
ALTER COLUMN event_date
SET NOT NULL;
-- CATEGORY
CREATE TABLE category (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO category (name)
VALUES ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');
-- PROJECT <-> CATEGORY (many-to-many)
CREATE TABLE project_category (
    project_id INT NOT NULL REFERENCES service_project (id),
    category_id INT NOT NULL REFERENCES category (id),
    PRIMARY KEY (project_id, category_id)
);
INSERT INTO project_category (project_id, category_id)
VALUES (1, 1),
    (1, 3),
    (2, 3),
    (2, 4),
    (3, 2);
SELECT *
FROM organization;
SELECT *
FROM category;
--============================================
    -- week 5 work
    CREATE TABLE roles (
        role_id SERIAL PRIMARY KEY,
        role_name VARCHAR(50) UNIQUE NOT NULL,
        role_description TEXT
    );
INSERT INTO roles (role_name, role_description)
VALUES ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT *
FROM roles;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user
INSERT INTO users (name, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users WHERE email = 'test@example.com';

--============================================
-- week 6 work
-- Promote a user to the admin role
UPDATE users
SET role_id = (SELECT role_id FROM roles WHERE role_name = 'admin')
WHERE email = 'cramsey@byupathway.edu';

-- Dedicated admin testing account for the grader.
-- Username: admin@example.com   Password: cse340!
-- The password_hash below is the bcrypt hash of 'cse340!'.
INSERT INTO users (name, email, password_hash, role_id)
VALUES (
        'Admin Tester',
        'admin@example.com',
        '$2b$10$ZP0O9maqBVzkxlGbfjQq.Oy5dG4HMqBOQrWwWVnTHfbZuRhQ1FuFi',
        (SELECT role_id FROM roles WHERE role_name = 'admin')
    ) ON CONFLICT (email) DO NOTHING;

-- Show every registered user with their role (what the /users page displays)
SELECT users.user_id, users.name, users.email, roles.role_name
FROM users
JOIN roles ON users.role_id = roles.role_id
ORDER BY users.name;
