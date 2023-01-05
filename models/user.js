const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // { items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    db.collection('users').intertOne(this);
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.finIndex((cp) => {
    //   return cp._id === product._id;
    // });
    const updateCart = { items: [{ ...product, quantity: 1 }] };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updateCart } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        // console.log('user', user);
        return user;
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
}

module.exports = User;
