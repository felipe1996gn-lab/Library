/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { MongoClient, ObjectId } = require('mongodb');

let db;

// Initialize MongoDB connection
if (process.env.DB) {
  MongoClient.connect(process.env.DB)
    .then(client => {
      console.log('Connected to MongoDB');
      db = client.db('personal_library');
    })
    .catch(error => {
      console.error('MongoDB connection error:', error);
      // For FreeCodeCamp testing, we'll use in-memory storage as fallback
      console.log('Using in-memory storage for testing');
      db = null;
    });
} else {
  console.log('No DB connection string found, using in-memory storage for testing');
  db = null;
}

// In-memory storage for testing when DB is not available
let inMemoryBooks = [];
let nextId = 1;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      if (!db) {
        // Use in-memory storage for testing
        const response = inMemoryBooks.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments ? book.comments.length : 0
        }));
        return res.json(response);
      }
      
      db.collection('books').find({}).toArray()
        .then(books => {
          const response = books.map(book => ({
            _id: book._id,
            title: book.title,
            commentcount: book.comments ? book.comments.length : 0
          }));
          res.json(response);
        })
        .catch(err => {
          console.error('Error fetching books:', err);
          res.status(500).send('could not perform operation');
        });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      
      if (!title) {
        return res.send('missing required field title');
      }
      
      if (!db) {
        // Use in-memory storage for testing
        const newBook = {
          _id: nextId.toString(),
          title: title,
          comments: []
        };
        inMemoryBooks.push(newBook);
        nextId++;
        return res.json({
          _id: newBook._id,
          title: title
        });
      }
      
      const newBook = {
        title: title,
        comments: []
      };
      
      db.collection('books').insertOne(newBook)
        .then(result => {
          res.json({
            _id: result.insertedId,
            title: title
          });
        })
        .catch(err => {
          console.error('Error creating book:', err);
          res.status(500).send('could not perform operation');
        });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      if (!db) {
        // Use in-memory storage for testing
        inMemoryBooks = [];
        nextId = 1;
        return res.send('complete delete successful');
      }
      
      db.collection('books').deleteMany({})
        .then(result => {
          res.send('complete delete successful');
        })
        .catch(err => {
          console.error('Error deleting all books:', err);
          res.status(500).send('could not perform operation');
        });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      if (db && !ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      if (!db) {
        // Use in-memory storage for testing
        const book = inMemoryBooks.find(b => b._id === bookid);
        if (!book) {
          return res.send('no book exists');
        }
        return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments || []
        });
      }
      
      db.collection('books').findOne({ _id: new ObjectId(bookid) })
        .then(book => {
          if (!book) {
            return res.send('no book exists');
          }
          
          res.json({
            _id: book._id,
            title: book.title,
            comments: book.comments || []
          });
        })
        .catch(err => {
          console.error('Error fetching book:', err);
          res.status(500).send('could not perform operation');
        });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      
      if (!comment) {
        return res.send('missing required field comment');
      }
      
      if (db && !ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      if (!db) {
        // Use in-memory storage for testing
        const book = inMemoryBooks.find(b => b._id === bookid);
        if (!book) {
          return res.send('no book exists');
        }
        book.comments.push(comment);
        return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      }
      
      db.collection('books').findOneAndUpdate(
        { _id: new ObjectId(bookid) },
        { $push: { comments: comment } },
        { returnDocument: 'after' }
      )
        .then(result => {
          if (!result.value) {
            return res.send('no book exists');
          }
          
          res.json({
            _id: result.value._id,
            title: result.value.title,
            comments: result.value.comments || []
          });
        })
        .catch(err => {
          console.error('Error adding comment:', err);
          res.status(500).send('could not perform operation');
        });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      
      if (db && !ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      if (!db) {
        // Use in-memory storage for testing
        const bookIndex = inMemoryBooks.findIndex(b => b._id === bookid);
        if (bookIndex === -1) {
          return res.send('no book exists');
        }
        inMemoryBooks.splice(bookIndex, 1);
        return res.send('delete successful');
      }
      
      db.collection('books').deleteOne({ _id: new ObjectId(bookid) })
        .then(result => {
          if (result.deletedCount === 0) {
            return res.send('no book exists');
          }
          
          res.send('delete successful');
        })
        .catch(err => {
          console.error('Error deleting book:', err);
          res.status(500).send('could not perform operation');
        });
    });
  
};
