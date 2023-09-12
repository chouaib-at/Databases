
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://chouaibatrous003:chxx2904@cluster0.zhyo6ge.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const countries = client.db("week4").collection("countryinfo");
    // question 02
    const getPopulationOfCountry = async(country)=>{
        const sumPopulationByYearForEachCountry = [
            {
            $match:{
                Country:country
            }
            },
            {
                $group: {
                  _id: "$Year", // Group by the "Year" field
                  totalPopulation: { $sum: { $add: ["$M", "$F"] } }
                }
              }
          ];
          try {
              return await countries.aggregate(sumPopulationByYearForEachCountry).toArray()
            
          } catch (error) {
              console.log(error.message)
        }
    }
    const result = await getPopulationOfCountry("Netherlands")
    console.log('population',result)
    // question 03
    const getContinents = async(age,year)=>{
        const continents = ["AFRICA", "EUROPE", "ASIA", "NORTH AMERICA", "SOUTH AMERICA", "AUSTRALIA"];
        const pipeline = [
            {
                $match:{
                    Country: { $in: continents }
                }
            },
            {
                $match:{
                    Age:age
                }
            },
            {
                $match:{
                    Year:year
                }
            },
            {
                $addFields: {
                    TotalPopulation: { $add: ["$M", "$F"] }
                }
            }
        ]
        try {
            const continents = countries.aggregate(pipeline).toArray()
            return continents
        } catch (error) {
            console.log(error.message)
        }
    }
    // exemple
    const res = await getContinents("0-4",1990)
    console.log('continents',res)
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
