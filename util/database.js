const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  // MongoClient.connect(
  //   'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/test?retryWrites=true'
  // )
  // MongoClient.connect("mongodb://localhost:27017/mern_auth", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // })
  MongoClient.connect(
    `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASS}@cluster0.ir4appl.mongodb.net/shop?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
