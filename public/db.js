// check for indexedDB browser support
const request = window.indexedDB.open("expense", 1);

let db;
// create a new db request for a "budget" database.

request.onupgradeneeded = function (event) {
  // create object store called "pending" and set autoIncrement to true
  const db = event.target.result;

  db.createObjectStore("expense", { autoIncrement: true });
  // Creates a statusIndex that we can query on.

};

request.onsuccess = function (event) {
  db = event.target.result
};

request.onerror = function (event) {
  // log error here
};

function saveRecord(record) {
  const transaction = db.transaction(["expense"], "readwrite");
  const store = transaction.objectStore("expense");
  // create a transaction on the pending db with readwrite access
  // access your pending object store
  // add record to your store with add method.
  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["expense"], "readwrite");
  const store = transaction.objectStore("expense");
  const getAll = store.getAll()
  // open a transaction on your pending db
  // access your pending object store
  // get all records from store and set to a variable

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          const transaction = db.transaction(["expense"], "readwrite");
          const store = transaction.objectStore("expense");
          store.clear()

          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);