let express = require("express")
let MongoClient = require("mongodb").MongoClient
let ObjectId = require("mongodb").ObjectID
let app = express()
let port = 1337 || process.env.PORT
let db_name = "heroku_7k2r28vz"
let url = "mongodb://admin:q2w3e4r5@ds263917.mlab.com:63917/heroku_7k2r28vz"
let bodyParser = require("body-parser")

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get("/get_all", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbo = db.db(db_name)
        dbo.collection("conv").find().toArray((err, result) => {
            if(err) throw err;
            res.json(result)
        })
    })
})

app.get("/get", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbo = db.db(db_name)
        dbo.collection("conv").findOne({_id: ObjectId(req.query.id)}, (err, result) => {
            if(err) throw err;
            res.json(result)
        })
    })
})

app.post("/add_conv", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbo = db.db(db_name)
        var json = req.body;
        json.status = 1;
        dbo.collection('images').insertOne({photo: json.photo}, (err, result) => {
            if (err) throw err;
            json.photo = result.insertedId;
            dbo.collection("conv").insertOne(json, (err) => {
                if(err) throw err;
                res.json({type: "ok"})
            })
        })
    })
})

app.get('/img/:id', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db(db_name)
        dbo.collection('images').findOne({_id: ObjectId(req.params.id)}, (err, doc) => {
            if (err) throw err;
            res.contentType(doc.contentType);
            res.send(doc.data.buffer);
        })
    })
})

app.get("/good", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbo = db.db(db_name)
        dbo.collection("conv").updateOne({_id: ObjectId(req.query.id)}, {$set: {status: 2}}, (err) => {
            if(err) throw err;
            res.json({type: "ok"})
        })
    })
})

app.get("/remove", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbo = db.db(db_name)
        dbo.collection("conv").remove({_id: ObjectId(req.query.id)}, (err) => {
            if(err) throw err;
            res.json({type: "ok"})
        })
    })
})

app.listen(port)