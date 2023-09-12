const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const dbName = 'moneytransfer';
const collectionName = 'accounts';

async function setupData() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});

    await collection.insertMany([
      {
        account_number: 101,
        balance: 10000,
        account_changes: [],
      },
      {
        account_number: 102,
        balance: 4000,
        account_changes: [],
      },
    ]);

    console.log('The sample data inserted successfully.');
  } catch (err) {
    console.error('Error during setup:', err);
  } finally {
    client.close();
  }
}

module.exports = setupData;
