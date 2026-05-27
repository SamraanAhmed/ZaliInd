const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
  db.all('SELECT id, images FROM products', [], (err, products) => {
    products.forEach(p => {
      if (p.images && p.images.startsWith('{"0":"{","1":"\\"","2":"f"')) {
        try {
          let parsed = JSON.parse(p.images);
          let str = Object.values(parsed).join('');
          // test if str is valid JSON
          JSON.parse(str);
          console.log('Fixing:', p.id);
          db.run('UPDATE products SET images = ? WHERE id = ?', [str, p.id]);
        } catch(e) {
          console.error(e);
        }
      }
    });
  });
});
