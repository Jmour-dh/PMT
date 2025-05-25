-- Création des tables
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME,
    created_by BIGINT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE project_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    priority VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'TODO',
    created_by BIGINT NOT NULL,
    assignee_id BIGINT,
    project_id BIGINT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE task_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    changed_field VARCHAR(255) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    modified_by BIGINT NOT NULL,
    modification_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertion des données de test
INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@example.com', '$2a$10$WDZfMHrFNvgwxiPwJ0Is8ewh/enm8rKhJTZx6hlYDabxP5XYZSG3W'),-- le password est : 123456,
('user1', 'user1@example.com', '$2a$10$WDZfMHrFNvgwxiPwJ0Is8ewh/enm8rKhJTZx6hlYDabxP5XYZSG3W'),-- le password est : 123456,
('user2', 'user2@example.com', '$2a$10$WDZfMHrFNvgwxiPwJ0Is8ewh/enm8rKhJTZx6hlYDabxP5XYZSG3W');-- le password est : 123456,

INSERT INTO projects (name, description, start_date, created_by) VALUES
('Project A', 'Description of Project A', '2023-01-01 10:00:00', 1),
('Project B', 'Description of Project B', '2023-02-01 10:00:00', 1);

INSERT INTO project_members (user_id, project_id, role) VALUES
(2, 1, 'MEMBER'),
(3, 1, 'OBSERVER'),
(2, 2, 'ADMIN');

INSERT INTO tasks (title, description, due_date, priority, status, created_by, assignee_id, project_id) VALUES
('Task 1', 'Description of Task 1', '2023-03-01 10:00:00', 'HIGH', 'TODO', 1, 2, 1),
('Task 2', 'Description of Task 2', '2023-03-15 10:00:00', 'MEDIUM', 'IN_PROGRESS', 1, 3, 1),
('Task 3', 'Description of Task 3', '2023-04-01 10:00:00', 'LOW', 'DONE', 1, NULL, 2);

INSERT INTO task_history (task_id, changed_field, old_value, new_value, modified_by) VALUES
(1, 'status', 'TODO', 'IN_PROGRESS', 1),
(1, 'status', 'IN_PROGRESS', 'DONE', 2),
(2, 'priority', 'MEDIUM', 'HIGH', 3);