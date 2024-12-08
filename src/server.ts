// import { QueryResult } from "pg";
// import { pool, connectToDb } from "./connection.js";
import { connectToDb } from "./connection.js";
import inquirer from "inquirer";
import { addDepartment, viewAllDepartments } from "./departments.js";
import { addRole, viewAllRoles } from "./roles.js";
import {
  addEmployee,
  updateEmployeeRole,
  viewAllEmployees,
} from "./employees.js";

await connectToDb();

const actionQuestions = [
  {
    name: "Action",
    message: `Please choose an action:`,
    type: "list",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
    ],
  },
];

// TODO: Create a function to initialize app
function init() {
  inquirer.prompt(actionQuestions).then((answers: any) => {
    switch (answers.Action) {
      case "view all departments":
        viewAllDepartments();
        break;
      case "view all roles":
        viewAllRoles();
        break;
      case "view all employees":
        viewAllEmployees();
        break;
      case "add a department":
        addDepartment();
        break;
      case "add a role":
        addRole();
        break;
      case "add an employee":
        addEmployee();
        break;
      case "update an employee role":
        updateEmployeeRole();
        break;
    }
  });
}

// Function call to initialize app
init();
