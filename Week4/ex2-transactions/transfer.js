const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const dbName = 'moneytransfer';
const collectionName = 'accounts';


async function transferMoney(fromAccountNumber, toAccountNumber, amount, remark) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const session = client.startSession();
    session.startTransaction();

    const fromAccount = await collection.findOne({ account_number: fromAccountNumber });
    const toAccount = await collection.findOne({ account_number: toAccountNumber });

    if (!fromAccount || !toAccount || fromAccount.balance < amount) {
      throw new Error('Insufficient balance or invalid account number');
    }

    const fromChangeNumber = fromAccount.account_changes.length;
    const toChangeNumber = toAccount.account_changes.length;

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    fromAccount.account_changes.push({
      change_number: fromChangeNumber + 1,
      amount: -amount,
      changed_date: new Date(),
      remark,
    });

    toAccount.account_changes.push({
      change_number: toChangeNumber + 1,
      amount,
      changed_date: new Date(),
      remark,
    });

    await collection.updateOne({ account_number: fromAccountNumber }, { $set: fromAccount });
    await collection.updateOne({ account_number: toAccountNumber }, { $set: toAccount });

    await session.commitTransaction();
    console.log('Transaction is successful.');
  } catch (err) {
    console.error('Error during money transfer:', err);
    await session.abortTransaction();
  } finally {
    session.endSession();
    client.close();
  }
}

transferMoney(101, 102, 1000, 'test your payment methode')
  .catch(console.error);

module.exports = transferMoney;
