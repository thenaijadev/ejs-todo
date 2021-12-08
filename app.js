const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const newItems = ["Buy Food", "Cook Food", "Eat Food"];

const  workItems = [];


app.get("/", (req, res) => {
    const day = date.getDate ()

    res.render("list", {
        listTitle: day,
        newItems: newItems
    });
});

app.post("/", (req, res) => {

   const newItem = req.body.newItem;

    newItems.push(newItem);
    res.redirect("/");



    // The code above points to the get route in order to grab the variable "newitem"


});

app.get("/work", (req, res) => {
    res.render("worklist", {
        listTitle: "Work List",
        workItems: workItems
    });
});


app.post("/work", (req, res) => {
    let newWorkItem = req.body.newWorkItem;
    workItems.push(newWorkItem);
    res.redirect("/work");
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});