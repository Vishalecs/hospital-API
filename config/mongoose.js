const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://vishalecs:Vishal123321@cluster0.ded7prj.mongodb.net/hospital1`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to the db'));

db.once('open', function () {
  console.log("Successfully connected to the Database");
});

module.exports = db;
