const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
  db.run("BEGIN TRANSACTION;");

  // 1. Update the main category
  db.run("UPDATE categories SET id = 'fitnesswear', name = 'FitnessWear', slug = 'fitnesswear' WHERE id = 'sportswear'");

  // 2. Update subcategories' categoryId
  db.run("UPDATE subcategories SET categoryId = 'fitnesswear' WHERE categoryId = 'sportswear'");

  // 3. Update subcategories' id (replace 'sportswear-' with 'fitnesswear-')
  db.run("UPDATE subcategories SET id = replace(id, 'sportswear-', 'fitnesswear-') WHERE id LIKE 'sportswear-%'");

  // 4. Update products' categoryId
  db.run("UPDATE products SET categoryId = 'fitnesswear' WHERE categoryId = 'sportswear'");

  // 5. Update products' subcategoryId
  db.run("UPDATE products SET subcategoryId = replace(subcategoryId, 'sportswear-', 'fitnesswear-') WHERE subcategoryId LIKE 'sportswear-%'");

  // 6. Update products' id
  db.run("UPDATE products SET id = replace(id, 'sportswear-', 'fitnesswear-') WHERE id LIKE 'sportswear-%'");

  // 7. Update images paths in products (JSON string)
  // Replaces 'SportsWear/' with 'FitnessWear/' inside the images JSON
  db.run("UPDATE products SET images = replace(images, 'SportsWear/', 'FitnessWear/') WHERE categoryId = 'fitnesswear'");

  db.run("COMMIT;", (err) => {
    if (err) {
      console.error("Error updating DB:", err);
    } else {
      console.log("Database successfully updated to FitnessWear.");
    }
    db.close();
  });
});
