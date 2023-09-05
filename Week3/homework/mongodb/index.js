const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();

const { seedDatabase } = require("./seedDatabase.js");

async function createEpisodeExercise(client) {
  /**
   * We forgot to add the last episode of season 9. It has this information:
   *
   * episode: S09E13
   * title: MOUNTAIN HIDE-AWAY
   * elements: ["CIRRUS", "CLOUDS", "CONIFER", "DECIDIOUS", "GRASS", "MOUNTAIN", "MOUNTAINS", "RIVER", "SNOWY_MOUNTAIN", "TREE", "TREES"]
   */

  // Write code that will add this to the collection!
try {
  const episodeData = {
    episode: "S09E13",
    title: "MOUNTAIN HIDE-AWAY",
    elements: ["CIRRUS", "CLOUDS", "CONIFER", "DECIDUOUS", "GRASS", "MOUNTAIN", "MOUNTAINS", "RIVER", "SNOWY_MOUNTAIN", "TREE", "TREES"]
  };

  // Insert the new document into the collection
  const result = await db.collection(collectionName).insertOne(episodeData);

  console.log(
    `Created season 9 episode 13 and the document got the id ${"TODO: fill in variable here"}`
  );
} catch (error) {
  console.error("Error creating episode:", error);
}
}

async function findEpisodesExercises(client) {
  const databaseName = "dataBaseWeek3";
  const collectionName = "bob_ross_episodes";
  const collection = client.db(databaseName).collection(collectionName);

  // Exercise 1: Find the title of episode 2 in season 2
  const episode2Season2 = await collection.findOne({ episode: "S02E02" });
  console.log(`The title of episode 2 in season 2 is ${episode2Season2.title}`);

  // Exercise 2: Find the season and episode number of the episode called "BLACK RIVER"
  const blackRiverEpisode = await collection.findOne({ title: "BLACK RIVER" });
  console.log(`The season and episode number of the "BLACK RIVER" episode is ${blackRiverEpisode.episode}`);

  // Exercise 3: Find all of the episode titles where Bob Ross painted a CLIFF
  const cliffEpisodes = await collection.find({ elements: "CLIFF" }, { projection: { title: 1, _id: 0 } }).toArray();
  const cliffEpisodeTitles = cliffEpisodes.map((episode) => episode.title);
  console.log(`The episodes that Bob Ross painted a CLIFF are ${cliffEpisodeTitles.join(", ")}`);

  // Exercise 4: Find all of the episode titles where Bob Ross painted a CLIFF and a LIGHTHOUSE
  const cliffLighthouseEpisodes = await collection.find({ elements: { $all: ["CLIFF", "LIGHTHOUSE"] } }, { projection: { title: 1, _id: 0 } }).toArray();
  const cliffLighthouseEpisodeTitles = cliffLighthouseEpisodes.map((episode) => episode.title);
  console.log(`The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${cliffLighthouseEpisodeTitles.join(", ")}`);
}

async function updateEpisodeExercises(client) {
  const databaseName = "dataBaseWeek3";
  const collectionName = "bob_ross_episodes";
  const collection = client.db(databaseName).collection(collectionName);

  // Exercise 1: Update the title of episode 13 in season 30
  const updateResult1 = await collection.updateOne({ episode: "S30E13" }, { $set: { title: "BLUE RIDGE FALLS" } });
  console.log(`Ran a command to update episode 13 in season 30, and it updated ${updateResult1.modifiedCount} episodes`);

  // Exercise 2: Update 'BUSHES' to 'BUSH' in elements array for all relevant documents
  const updateResult2 = await collection.updateMany({ elements: "BUSHES" }, { $set: { "elements.$": "BUSH" } });
  console.log(`Ran a command to update all BUSHES to BUSH, and it updated ${updateResult2.modifiedCount} episodes`);
}

async function deleteEpisodeExercise(client) {
  const databaseName = "dataBaseWeek3";
  const collectionName = "bob_ross_episodes";
  const collection = client.db(databaseName).collection(collectionName);

  // Exercise: Delete episode 14 in season 31
  const deleteResult = await collection.deleteOne({ episode: "S31E14" });
  console.log(`Ran a command to delete episode, and it deleted ${deleteResult.deletedCount} episodes`);
}


async function main() {
  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`
    );
  }
  
  const client = new MongoClient(process.env.MONGODB_URL, {
    // useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed our database
    await seedDatabase(client);

    // CREATE
    await createEpisodeExercise(client);

    // READ
    await findEpisodesExercises(client);

    // UPDATE
    await updateEpisodeExercises(client);

    // DELETE
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
}

main();

