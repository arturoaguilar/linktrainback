const express = require('express');
const app = express();
var cors = require('cors');

app.use(cors());
app.options('*', cors());
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
//const connectionString = "mongodb+srv://roccorockets:mamadegordos@cluster0.vsxkl.mongodb.net/projectsback?retryWrites=true&w=majority";
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const connectionString = process.env.MONGODB_URI;


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db('linktraindb')

    app.get('/links', cors(), (req, res) => {

      db.collection('userlinks').find().toArray()
        .then(results => {

          res.send(results)
        })
        .catch(error => console.error(error))

    }),
      app.get('/user/:name', cors(), (req, res) => {
        var userName = req.params.name;
        db.collection('users').find({ name: userName }).toArray()
          .then(result => {
            res.send(result)
          })
          .catch(error => console.error(error))

      })
    app.get('/links/:name', cors(), (req, res) => {
      var userName = req.params.name;
      db.collection('userlinks').find({ name: userName }).toArray()
        .then(results => {

          res.send(results)
        })
        .catch(error => console.error(error))

    })

    app.post('/newlink', cors(), (req, res) => {

      db.collection('userlinks').insertOne(req.body)
        .then(result => {
          console.log(result)
          res.send(req.body)
        })
        .catch(error => console.error(error))
    })

    app.put('/updateotherlinksorder', cors(), (req, res) => {

      // db.collection('userlinks').updateMany({ order: { $gt: req.body.order }, _id: { $ne: ObjectId(req.body._id) } }, { 
      // { results: { $elemMatch: { $gte: 80, $lt: 85 } } }

      /* db.collection('userlinks').updateMany({ order: { $gt: req.body.order } }, { 
         $set: { 
           $inc: { order: 6 } 
         }
       })*/



      db.collection('userlinks').find({ order: { $gt: req.body.order } }).toArray()
        .then(result => {
          console.log("THE OTHER LINKS")
          console.log("1) start order")
          console.log(req.body.order)
          console.log(result)
          //res.send(result)
          for (let linkItem in result) {
            /*The update */
            
            db.collection('userlinks').findOneAndUpdate({ _id: ObjectId(linkItem._id) }, {
              $set: {
                order: linkItem.order+1
              }
            },
              { upsert: true }
            )
              .then(resultam => {
                console.log(`Estos son los id `);
                console.log(linkItem);
                res.send(resultam)
              }).catch(error => console.error(error));

            /*Fin del Update*/
          }

        }).catch(error => console.error(error));

    })

    app.put('/updateonelinkposition', cors(), (req, res) => {

      db.collection('userlinks').findOneAndUpdate({ _id: ObjectId(req.body._id) }, {
        $set: {
          order: req.body.order
        }
      },
        { upsert: true }
      )
        .then(result => {
          res.send(result)
        });


    })




  })


/*
app.listen(3000, function () {
    console.log('listening on 3000')
})*/
app.listen(process.env.PORT, '0.0.0.0');