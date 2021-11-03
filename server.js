const express = require('express');
const inquirer = require("inquirer");
const mysql = require('mysql2');
require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mySqlDB = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '#sonicSpeed1',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
)

mySqlDB.connect(function (err) {
  if (err) throw err;
  console.log("SQL Connected");
  startTracker();
});


const startTracker= () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update An Employee Role',
        'Quit'
      ]
    },
  ])

.then((response) => {
  switch (response.options) {
    case 'View employees': 
    viewAll();
    break;

    case 'View roles':
      viewAllRoles();
      break;

    case 'View departments':
      viewAllDpt(); 
      break;

    case 'Add employee': 
      addEmployee();
      break;

    case 'Add role': 
      addRole();
      break;

    case 'Add department':
      addDpt(); 
      break;

    case 'Update employee role':
      updateRole
      break;

    default:
      mySqlDB.end();
      break;
    }
  })
}


function addEmployee() {

  mySqlDB.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;

    inquirer.prompt([
        {
          type: "input",
          name: "firstname",
          message: "Enter employee's first name"
        },
        {
          type: "input",
          name: "lastname",
          message: "Enter employee's last name"
        },
        {
          name: "choice",
          type: "rawlist",
          choices: function () {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].title);
              }

              return choiceArray;
          },
          message: "Enter employee's role"
        },

        {
          type: "input",
          name: "manager",
          message: "Enter employee's manager?"
        }

      ]).then(function (res) {


        for (var i = 0; i < results.length; i++) {
            if (results[i].title === res.choice) {
                res.role_id = results[i].id;
            }
        }
        var query = "INSERT INTO employee SET ?"
        const VALUES = {
            first_name: res.firstname,
            last_name: res.lastname,
            role_id: res.role_id
        }
        mySqlDB.query(query, VALUES, function (err) {
            if (err) throw err;
            console.log("Employee Hired");
            tracker()
        }

        )
      }) 
  })

}

function addRole() {
  var roleQuery = "SELECT * FROM role;";
  var departmentQuery = "SELECT * FROM department;";


  mySqlDB.query(roleQuery, function (err, roles) {
      mySqlDB.query(departmentQuery, function (err, departments) {

          if (err) throw err;

          inquirer.prompt([

            {
              name: "newRole",
              type: "rawlist",
              choices: function () {
                  var arrayOfChoices = [];
                  for (var i = 0; i < roles.length; i++) {
                      arrayOfChoices.push(roles[i].title);
                  }

                  return arrayOfChoices;
              },
              message: "Add another position"
            },
            {
              name: "newSalary",
              type: "input",
              message: "Add Salary"

            },
            {
              name: "choice",
              type: "rawlist",
              choices: function ()
               {
                var arrayOfChoices = [];
                for (var i = 0; i < departments.length; i++) {
                  arrayOfChoices.push(departments[i].name);
                }

                return arrayOfChoices;
              },
              message: "Which department this role belongs to?"
            },

        ]).then(function (result) {

          for (var i = 0; i < departments.length; i++) {
            if (departments[i].name === result.choice) {
              result.department_id = departments[i].id;
            }
          }

          var query = "INSERT INTO role SET ?"
          const VALUES = {

            title: result.newRole,
            salary: result.newSalary,
            department_id: result.department_id
          }

          mySqlDB.query(query, VALUES, function (err) {
            if (err) throw err;
            console.table("Role created");
            tracker()
          });

        })
    })
  })
}

function viewAll() {
  mySqlDB.query("SELECT first_name AS FirstName , last_name as LastName , role.title as Role, role.salary AS Salary, department.name AS Department FROM employee INNER JOIN department ON department.id = employee.role_id left JOIN role ON role.id = employee.role_id", function (err, results) {
      console.table(results);
      if (err) throw err;
      tracker()
  });
}

function viewAllDpt() {
  mySqlDB.query("SELECT name AS Departments FROM department ", function (err, results) {
      console.table(results);
      if (err) throw err;
      tracker()
  });
}

function viewAllRoles() {
  mySqlDB.query("Select title as Roles from role ", function (err, results) {
      console.table(results);
      if (err) throw err;
      tracker()
  });
}

function updateRole() {
  var roleQuery = "SELECT * FROM role;";
  var departmentQuery = "SELECT * FROM department;";


  mySqlDB.query(roleQuery, function (err, roles) {
      mySqlDB.query(departmentQuery, function (err, departments) {

          if (err) throw err;
          inquirer.prompt([

              {
                  name: "newRole",
                  type: "rawlist",
                  choices: function () {
                      var arrayOfChoices = [];
                      for (var i = 0; i < roles.length; i++) {
                          arrayOfChoices.push(roles[i].title);
                      }

                      return arrayOfChoices;
                  },
                  message: "Which Role would you like to update?"
              },
              {
                  name: "newSalary",
                  type: "input",
                  message: "What is the new salary for this role?"

              },
              {
                  name: "choice",
                  type: "rawlist",
                  choices: function () {
                      var arrayOfChoices = [];
                      for (var i = 0; i < departments.length; i++) {
                          arrayOfChoices.push(departments[i].name);
                      }
                      return arrayOfChoices;
                  },
                  message: "Which department this role belongs to?"
              },
          ]).then(function (result) {

              for (var i = 0; i < departments.length; i++) {
                  if (departments[i].name === result.choice) {
                      result.department_id = departments[i].id;
                  }
              }
              var query = "UPDATE role SET title=?,salary= ? WHERE department_id= ?"
              const VALUES = [

                  { title: result.newRole },
                  { salary: result.newSalary },
                  { department_id: result.department_id }
              ]
              let query1 = mySqlDB.query(query, VALUES, function (err) {
                  if (err) throw err;
                  console.table("Role Successfuly Updated!");
                  tracker()
              });

          })
      })
  })
}