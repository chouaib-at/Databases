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

const insertDataIntoAccount = `
INSERT INTO account (account_number, balance)
VALUES
    (101, 5000.00),
    (102, 3000.00);
`;



const insertDataIntoAccountChange = `
INSERT INTO account_changes (change_number, account_number, amount, changed_date, remark)
VALUES
    (1, 101, -1000.00, '2024-02-02', 'Transfer to account 102'),
    (2, 102, 1000.00, '2024-02-02', 'Transfer from account 101');
`;


connection.query(insertDataIntoAccount, (err) => {
    if (err) {
      console.error('Error inserting account data:', err);
      return;
    }
    console.log(' data inserted into account table');
  });
  
  connection.query(insertDataIntoAccountChange, (err) => {
    if (err) {
      console.error('Error inserting account_changes data:', err);
      return;
    }
    console.log(' data inserted into account_changes table');
  });