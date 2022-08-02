import sqlite3 from "sqlite3";
let db = new sqlite3.Database("sample.db");


function getCategoryId(bookObj, linkCategoryToBook) {
  let sel_sql = `select * from categories where name = '${bookObj.category}'`;
  db.each(sel_sql, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    linkCategoryToBook(bookObj, row.id);
  });
}

function linkCategoryToBook(bookObj, category_id) {
  let sql = `INSERT INTO books(name, price, rating, categoryId) VALUES('${bookObj.name}', '${bookObj.price}', '${bookObj.rating}', ${category_id}) `;
  db.run(sql, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
}

export function addBooksToDb(bookObj) {
  db.get("PRAGMA foreign_keys = ON");

  getCategoryId(bookObj, linkCategoryToBook);
  // close the database connection
}

export function addCategoryToDb(category) {
  db.get("PRAGMA foreign_keys = ON");

  let sql = `INSERT INTO categories(name) VALUES('${category}') `;
  db.run(sql, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
  // close the database connection
}