import inquirer from "inquirer";
import { pool } from "./connection.js";

export const viewAllEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department_name, concat(manager.first_name, ' ', manager.last_name) as manager_name FROM employee join role on employee.role_id = role.id join department on role.department_id = department.id left join employee manager on employee.manager_id = manager.id`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(res.rows);
  });
};

export const addEmployee = () => {
  const sql = `SELECT * FROM role`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    const roles = res.rows.map((role: any) => {
      return { name: role.title, value: role.id };
    });
    const sql = `SELECT * FROM employee`;
    pool.query(sql, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      const employees = res.rows.map((employee: any) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        };
      });
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter employee's first name:",
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter employee's last name:",
          },
          {
            name: "role",
            type: "list",
            message: "Select employee's role:",
            choices: roles,
          },
          {
            name: "manager",
            type: "list",
            message: "Select employee's manager:",
            choices: [...employees, { name: "None", value: null }],
          },
        ])
        .then((answers: any) => {
          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
          pool.query(
            sql,
            [
              answers.firstName,
              answers.lastName,
              answers.role,
              answers.manager,
            ],
            (err, _res) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log(
                `Added employee ${answers.firstName} ${answers.lastName}`
              );
            }
          );
        });
    });
  });
};

export const updateEmployeeRole = () => {
  const sql = `SELECT * FROM employee`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    const employees = res.rows.map((employee: any) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    const sql = `SELECT * FROM role`;
    pool.query(sql, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      const roles = res.rows.map((role: any) => {
        return { name: role.title, value: role.id };
      });
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Select employee:",
            choices: employees,
          },
          {
            name: "role",
            type: "list",
            message: "Select new role:",
            choices: roles,
          },
        ])
        .then((answers: any) => {
          const sql = `UPDATE employee SET role_id = $1 WHERE id = $2`;
          pool.query(sql, [answers.role, answers.employee], (err, _res) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(`Updated employee's role`);
          });
        });
    });
  });
};
