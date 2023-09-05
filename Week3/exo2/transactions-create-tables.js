const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'User',
    password: 'HYF', 
    database: 'transaction',
  });
  

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const createAccountTable = `
CREATE TABLE IF NOT EXISTS account (
  account_number INT PRIMARY KEY,
  balance DECIMAL(10, 2) NOT NULL

    );
`;

const createAccountChanges = `
CREATE TABLE IF NOT EXISTS account_changes (
  change_number INT PRIMARY KEY,
  account_number INT,
  amount DECIMAL(10, 2) NOT NULL,
  changed_date DATE NOT NULL,
  remark VARCHAR(255),
  FOREIGN KEY (account_number) REFERENCES account(account_number)
    );
`;

connection.query(createAccountTable, (err) => {
  if (err) {
    console.error('Error creating account table:', err);
    return;
  }
  console.log('Account table created successfully');
});

connection.query(createAccountChanges, (err) => {
  if (err) {
    console.error('Error creating account_changes table:', err);
    return;
  }
  console.log('Account_changes table created successfully');
});