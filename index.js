const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
//const connectionString = "mongodb+srv://roccorockets:mamadegordos@cluster0.vsxkl.mongodb.net/projectsback?retryWrites=true&w=majority";
const connectionString =process.env.MONGODB_URI;

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/quotes', (req, res) => {
    res.send('2 ) Hello World')
})


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('linktraindb')

    app.get('/links', (req, res) => {
      /*  const cursor = db.collection('projects').find()
        console.log(cursor)
        res.send('3 ) Hello World')*/
        db.collection('userlinks').find().toArray()
        .then(results => {
         // console.log(results)
          res.send(results)
        })
        .catch(error => console.error(error))
      // ...
    }),
    app.get('/links/:name', (req, res) => {
      /*  const cursor = db.collection('projects').find()
        console.log(cursor)
        res.send('3 ) Hello World')*/

        var userName = req.params.name;
        db.collection('userlinks').find({name:userName}).toArray()
        .then(results => {
         // console.log(results)
          res.send(results)
        })
        .catch(error => console.error(error))
      // ...
    })


  })


/*
app.listen(3000, function () {
    console.log('listening on 3000')
})*/
app.listen(process.env.PORT, '0.0.0.0');