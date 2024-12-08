import inquirer from "inquirer";
import { pool } from "./connection.js";

export const viewAllRoles = () => {
  const sql = `SELECT role.title, role.salary, department.name as department_name FROM role join department on role.department_id = department.id`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(res.rows);
  });
};

export const addRole = () => {
  const sql = `SELECT * FROM department`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    const departments = res.rows.map((department: any) => {
      return { name: department.name, value: department.id };
    });
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "Enter role name:",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter role salary:",
        },
        {
          name: "department",
          type: "list",
          message: "Select department:",
          choices: departments,
        },
      ])
      .then((answers: any) => {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`;
        pool.query(
          sql,
          [answers.name, answers.salary, answers.department],
          (err, _res) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(`Added role ${answers.name}`);
          }
        );
      });
  });
};
