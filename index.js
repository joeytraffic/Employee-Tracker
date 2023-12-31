const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const { exit } = require("process");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employee_tracker_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the employee_tracker_db database.");
  promptUser();
});

const promptUser = () => {
  db.query("SELECT * FROM role", (err, roles) => {
    if (err) {
      console.error("Error executing the query: ", err);
      return;
    }

    db.query("SELECT * FROM employee", (err, employees) => {
      if (err) {
        console.error("Error executing the query: ", err);
        return;
      }

      db.query("SELECT * FROM department", (err, departments) => {
        if (err) {
          console.error("Error executing the query: ", err);
          return;
        }

        inquirer
          .prompt([
            {
              type: "list",
              name: "actionSelect",
              message: "What would you like to do?",
              choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit",
              ],
            },
          ])
          .then((answers) => {
            const { actionSelect } = answers;
            if (actionSelect === "View All Employees") {
              db.query("SELECT * FROM employee", (err, employees) => {
                if (err) {
                  console.error("Error executing the query: ", err);
                  return;
                }
                console.table(employees);
                promptUser();
              });
            } else if (actionSelect === "Add Employee") {
              inquirer
                .prompt([
                  {
                    type: "input",
                    name: "firstName",
                    message: "What is the employee's first name?",
                  },
                  {
                    type: "input",
                    name: "lastName",
                    message: "What is the employee's last name?",
                  },
                  {
                    type: "list",
                    name: "employeeRole",
                    message: "What is the employee's role?",
                    choices: roles.map((role) => role.title),
                  },
                ])
                .then((employeeData) => {
                  const selectedRole = roles.find(
                    (role) => role.title === employeeData.employeeRole
                  );
                  const roleId = selectedRole.id;

                  const newEmployee = {
                    first_name: employeeData.firstName,
                    last_name: employeeData.lastName,
                    role_id: roleId,
                  };

                  db.query(
                    "INSERT INTO employee SET ?",
                    newEmployee,
                    (err, res) => {
                      if (err) {
                        console.error("Error inserting employee: ", err);
                      } else {
                        console.log("Employee added successfully!");
                      }
                      promptUser();
                    }
                  );
                })
                .catch((err) => {
                  console.error("Error in prompting: ", err);
                  promptUser();
                });
            } else if (actionSelect === "Update Employee Role") {
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "employeeName",
                    message: "Which employee would you like to update?",
                    choices: employees.map(
                      (employees) =>
                        employees.first_name + " " + employees.last_name
                    ),
                  },
                  {
                    type: "list",
                    name: "employeeRole",
                    message: "What is the employee's new role?",
                    choices: roles.map((role) => role.title),
                  },
                ])
                .then((employeeData) => {
                  console.log(employeeData);
                  promptUser();
                })
                .catch((err) => {
                  console.error("Error in prompting: ", err);
                  promptUser();
                });
            } else if (actionSelect === "View All Roles") {
              db.query("SELECT * FROM role", (err, roles) => {
                if (err) {
                  console.error("Error executing the query: ", err);
                  return;
                }
                console.table(roles);
                promptUser();
              });
            } else if (actionSelect === "Add Role") {
              inquirer
                .prompt([
                  {
                    type: "input",
                    name: "roleName",
                    message: "What is the role you would like to add?",
                  },
                  {
                    type: "input",
                    name: "roleSalary",
                    message: "What is the salary for this role?",
                  },
                  {
                    type: "list",
                    name: "roleDepartment",
                    message: "What department does this role belong to?",
                    choices: departments.map((department) => department.name),
                  },
                ])
                .then((answers) => {
                  const roleName = answers.roleName;
                  const roleSalary = answers.roleSalary;
                  const departmentName = answers.roleDepartment;

                  // Find the department ID based on the department name
                  const department = departments.find(
                    (department) => department.name === departmentName
                  );
                  const departmentId = department.id;

                  const query =
                    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                  const values = [roleName, roleSalary, departmentId];
                  db.query(query, values, (err, result) => {
                    if (err) {
                      console.log("Error inserting role:", err);
                    } else {
                      console.log("New role added successfully!");
                      promptUser();
                    }
                  });
                })
                .catch((err) => {
                  console.error("Error in prompting: ", err);
                  promptUser();
                });
            } else if (actionSelect === "View All Departments") {
              db.query("SELECT * FROM department", (err, departments) => {
                if (err) {
                  console.error("Error executing the query: ", err);
                  return;
                }
                console.table(departments);
                promptUser();
              });
            } else if (actionSelect === "Add Department") {
              inquirer
                .prompt([
                  {
                    type: "input",
                    name: "departmentName",
                    message: "What is the department you would like to add?",
                  },
                ])
                .then((departmentData) => {
                  const { departmentName } = departmentData;

                  db.query(
                    "INSERT INTO department (name) VALUES (?)",
                    [departmentName],
                    (err, result) => {
                      if (err) {
                        console.error("Error inserting department:", err);
                      } else {
                        console.log("Department added successfully!");
                      }
                      promptUser();
                    }
                  );
                })
                .catch((err) => {
                  console.error("Error in prompting: ", err);
                  promptUser();
                });
            } else if (actionSelect === "Quit") {
              exit();
            }
          })
          .catch((err) => {
            console.error("Error in prompting: ", err);
            promptUser();
          });
      });
    });
  });
};
