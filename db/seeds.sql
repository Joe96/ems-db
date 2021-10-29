INSERT INTO department (name)
VALUES ("Department of Defense"),
("Department of Labor"),
("Department of Commerce"),
("Department of Energy"),
("Department of Education"),
("Department of Treasury"),
("Department of Transportation");

INSERT INTO role (title, salary, department_id)
VALUES  ("Secretary of Defense", 200000, 1),
("Secretary of Labor", 200000, 2),
("Secretary of Commerce", 200000, 3),
("Secretary of Energy", 200000, 4),
("Secretary of Education", 200000, 5),
("Secretary of Treasury", 200000, 6),
("Secretary of Transportation", 200000, 7),

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES VALUES ("Jane", "Doe", 1, 3),
("Joel", "Afamefune", 2, 3),
("Roy", "Woods", 3, 3),
("Amir", "Obre", 4, 3),
("Rockie", "Fresh", 5, 3),
("Isaiah", "Rashad", 6, 3),
("Marcus", "Garvey", 7, 3),
("Mick", "Jenkins", 8, 3);