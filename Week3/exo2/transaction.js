const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'User',
  password: 'HYF', 
  database: 'transaction',
});

connection.connect((err) => {
  if (err) {
    console.error('cann not connecting to MySQL:', err);
    return;
  }
  console.log('Your are Connected to MySQL database');
});

connection.beginTransaction((err)=>{
    if(err){
        console.error('Error beginning transaction:', err);
        return;
    }
})

connection.query(`
   UPDATE account
   SET balance = balance - 1000.00
   WHERE account_number = 101;
`, (err)=> {
    if(err){
        console.error('Error updating account 101 balance:', err)
        connection.rollback(()=>{
            console.error('Transaction rolled back')
        });
        return;
    }
connection.query(`
   UPDATE account
   SET balance = balance + 1000.00
   WHERE account_number = 102;
`, (err)=> {
    if(err){
        console.error('Error updating account 102 balance:', err)
        connection.rollback(()=>{
            console.error('Transaction rolled back')
        });
        return;
    }

connection.query(`
INSERT INTO account_changes (account_number, amount, changed_date, remark)
VALUES
  (101, -1000.00, '2024-02-02', 'Transfer to account 102'),
  (102, 1000.00, '2024-02-02', 'Transfer from account 101');
`, (err) =>{
    if(err) {
        console.error('Error logging account changes:', err);
        connection.rollback(() => {
            console.error('Transaction rolled back.')
        });
        return;
    }

connection.commit((err) => {
        if (err) {
          console.error('Error committing transaction:', err);
          connection.rollback(() => {
            console.error('Transaction rolled back.');
          });
        } else {
          console.log('Transaction completed successfully.');
        }
      });
})
})
})