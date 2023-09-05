const maliciousName = "'; DROP TABLE Countries; --";
const maliciousCode = "'; DROP TABLE Countries; --";

getPopulation("Countries", maliciousName, maliciousCode, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Population: " + result);
  }
});

function getPopulationSafe(Country, name, code, cb) {
  const query = "SELECT Population FROM ?? WHERE Name = ? and code = ?";
  const values = [Country, name, code];

  conn.query(query, values, function (err, result) {
    if (err) {
      cb(err);
    } else if (result.length === 0) {
      cb(new Error("Not found"));
    } else {
      cb(null, result[0].Population);
    }
  });
}