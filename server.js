var exp = require('express');
var app = exp();

var cors = require('cors');
app.use(cors());
app.use(exp.json());

var {MongoClient} = require('mongodb');
var MONGODB_URL = 'mongodb://localhost:27017';
var DATABASE_NAME = 'movies';
var client = new MongoClient(MONGODB_URL);


app.get("/getMovies",async(req,res)=>{
    try{
    
    await client.connect();
    let db = client.db(DATABASE_NAME);
    let dbResult = await db.collection("movieSearch").find({}).toArray();
    console.log(dbResult);
    res.status(200).json({"message":dbResult});
}catch(err){
    res.status(400).json({"message":err});
    console.log(err);
}
});



app.post("/postMovies",async(req,res)=>{
    try{
    let {title,plot,releaseDate,rating,poster} = req.body;
    let data={
        "title":title,
        "plot":plot,
        "releaseDate":releaseDate,
        "rating":rating,
        "poster":poster
    }
    await client.connect();
    let db = client.db(DATABASE_NAME);
    let existResult = await db.collection("movieSearch").find({"title":title},{"plot":plot},{"releaseDate":releaseDate},{"rating":rating},{"poster":poster}).toArray();
    //console.log(existResult);
    if(existResult.length>0){
        res.status(400).json({"message":"user is already found"})
    }else{
        await db.collection("movieSearch").insertOne(data);
        res.status(200).json({"message":"user is created successfully"});
    }
}catch(err){
    res.status(500).json({"message":err});
    console.log(err);
}
});



app.listen(8081,()=>{
    console.log("server started ....!!!");
});
