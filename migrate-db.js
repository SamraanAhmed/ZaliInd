const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'database.sqlite');
const dataPath = path.join(__dirname, 'public', 'products-data.js');

// Delete existing DB if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

async function migrate() {
  console.log('Reading products-data.js...');
  const rawContent = fs.readFileSync(dataPath, 'utf8');
  
  // Extract the JSON object from the file
  const jsonMatch = rawContent.match(/window\.ZALI_CATALOG\s*=\s*(\{[\s\S]*?\});/);
  if (!jsonMatch) {
    console.error('Could not find window.ZALI_CATALOG in products-data.js');
    process.exit(1);
  }
  
  // Safely parse the object. Since the data is formatted nicely, we can use Function or eval.
  // Using Function is safer than eval, but still requires trusting the local file (which we do).
  const catalog = new Function(`return ${jsonMatch[1]}`)();
  console.log(`Parsed ${catalog.categories.length} categories.`);

  db.serialize(async () => {
    // 1. Create Tables
    db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS subcategories (
      id TEXT PRIMARY KEY,
      categoryId TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      categoryId TEXT NOT NULL,
      subcategoryId TEXT NOT NULL,
      name TEXT NOT NULL,
      folderName TEXT,
      gender TEXT,
      title TEXT,
      description TEXT,
      garmentType TEXT,
      fabric TEXT,
      moq INTEGER,
      images JSON,
      FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE,
      FOREIGN KEY(subcategoryId) REFERENCES subcategories(id) ON DELETE CASCADE
    )`);

    // 2. Insert Default Admin
    const saltRounds = 10;
    const defaultPassword = 'admin';
    const hash = await bcrypt.hash(defaultPassword, saltRounds);
    
    db.run(`INSERT INTO admins (username, passwordHash) VALUES (?, ?)`, ['admin', hash], function(err) {
      if (err) console.error(err);
      else console.log('Created default admin (admin/admin)');
    });

    // 3. Insert Catalog Data
    const insertCat = db.prepare(`INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)`);
    const insertSub = db.prepare(`INSERT INTO subcategories (id, categoryId, name, slug) VALUES (?, ?, ?, ?)`);
    const insertProd = db.prepare(`INSERT INTO products (id, categoryId, subcategoryId, name, folderName, gender, title, description, garmentType, fabric, moq, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    for (const cat of catalog.categories) {
      insertCat.run([cat.id, cat.name, cat.slug]);
      
      for (const sub of cat.subcategories) {
        insertSub.run([sub.id, cat.id, sub.name, sub.slug]);
        
        for (const prod of sub.products) {
          const imgStr = JSON.stringify(prod.images || {});
          insertProd.run([
            prod.id, cat.id, sub.id, prod.name, prod.folderName, prod.gender,
            prod.title, prod.description, prod.garmentType, prod.fabric, prod.moq, imgStr
          ]);
        }
      }
    }

    insertCat.finalize();
    insertSub.finalize();
    insertProd.finalize();

    console.log('Migration complete. You can now start the server.');
  });
}

migrate();
