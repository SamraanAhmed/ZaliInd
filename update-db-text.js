const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
  db.run("BEGIN TRANSACTION;");

  // Replace sportswear in fabric strings (case-insensitive replace using lower/upper logic or just standard string replace)
  // SQLite REPLACE is case-sensitive, so we'll do lowercase and capitalized versions.
  
  const replacements = [
    { old: 'sportswear', new: 'fitnesswear' },
    { old: 'Sportswear', new: 'Fitnesswear' },
    { old: 'SportsWear', new: 'FitnessWear' },
  ];

  for (const {old: o, new: n} of replacements) {
    db.run(`UPDATE products SET description = replace(description, '${o}', '${n}') WHERE description LIKE '%${o}%'`);
    db.run(`UPDATE products SET fabric = replace(fabric, '${o}', '${n}') WHERE fabric LIKE '%${o}%'`);
    db.run(`UPDATE fabrics SET description = replace(description, '${o}', '${n}') WHERE description LIKE '%${o}%'`);
  }

  db.run("COMMIT;", (err) => {
    if (err) {
      console.error("Error updating DB:", err);
    } else {
      console.log("Database text descriptions successfully updated to Fitnesswear.");
    }
    db.close();
  });
});
