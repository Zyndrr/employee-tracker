import inquirer from "inquirer";
import { pool } from "./connection.js";

export const viewAllDepartments = () => {
  const sql = `SELECT * FROM department`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(res.rows);
  });
};

export const addDepartment = () => {
  inquirer
    .prompt([
      { name: "name", type: "input", message: "Enter department name:" },
    ])
    .then((answers: any) => {
      const sql = `INSERT INTO department (name) VALUES ($1)`;
      pool.query(sql, [answers.name], (err, _res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Added department ${answers.name}`);
      });
    });
};
