# Employee Tracker

## Description

Employee Tracker is a command-line application that allows you to manage employees, roles, and departments in a company. It provides functionality for adding employees, updating employee roles, viewing all roles, adding new roles, viewing all departments, adding new departments, and quitting the application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

---

## Installation

1. Clone the repository:

   ```
   git clone git@github.com:joeytraffic/Employee-Tracker.git
   ```

2. cd into your chosen directory.

3. Install all required dependencies in the root of the project.

   ```
   npm install
   ```

4. Install MYSQL, source the schema.sql, and then source the seeds.sql file.

   ```
   source db/schema.sql
   source db/seeds.sql
   ```

5. Make sure to update your MySQL connection details within the index.js.

---

## Usage

To run the application, enter the following command into a terminal in the project directory:

```
npm start
```

---

## License

MIT

---

## Contact

Please reach out to joey.tranvik@gmail.com if you have any questions.
