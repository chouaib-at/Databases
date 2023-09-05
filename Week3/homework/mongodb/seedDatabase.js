const data = require("./data.json");

/**
 * This function will drop and recreate the collection of sample data in our csv file.
 * By doing this we ensure that your functions are working on the same data, very similar to how you would set up a test environment.
 *
 * @param {MongoClient} client - The client that is connected to your database
 */
const seedDatabase = async (client) => {
  const databaseName = "dataBaseWeek3";
  const collectionName = "bob_ross_episodes";

  const db = client.db(databaseName);
  const collectionExists = await db
    .listCollections({ name: collectionName })
    .hasNext();

  if (!collectionExists) {
    // The collection doesn't exist, so let's create it
    await db.createCollection(collectionName);
    console.log(`Collection '${collectionName}' created.`);
  }

  // Now, you can proceed with your other operations (e.g., deleting documents and inserting new ones).
  const bobRossCollection = db.collection(collectionName);

  // Remove all the documents
  await bobRossCollection.deleteMany({});

  // Convert data to array version of elements
  const documents = data.map((dataItem) => {
    const { EPISODE, TITLE } = dataItem;

    const depictionElementKeys = Object.keys(dataItem).filter(
      (key) => !["EPISODE", "TITLE"].includes(key)
    );
    const depictionElements = depictionElementKeys.filter(
      (key) => dataItem[key] === 1
    );

    return {
      episode: EPISODE,
      // Remove the extra quotation marks
      title: TITLE.replaceAll('"', ""),
      elements: depictionElements,
    };
  });

  // Add our documents
  await bobRossCollection.insertMany(documents);
};


module.exports = {
  seedDatabase,
};
