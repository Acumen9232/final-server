exports.getUserID = (req,res)=>{
    console.log("api")
    var id = req.query.id
    res.json({
        "You id" : id
    })
}