const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

var newItems=["Buy Food","Cook Food","Eat Food"];

app.get("/", (req, res) => {

    var today = new Date();
    var currentDay = today.getDay();
    //Below reformats the date to a form easily readable by humans

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    var day = today.toLocaleDateString("en-US", options);
    console.log(day)
    //The above is to get the current date.
    //Below is for rendering using ejs templates
    res.render("list", {
        kindOfDay: day,
        newItems: newItems
    });
});

app.post("/", (req, res) => {
   var newItem= req.body.newItem;
    // The code below points to the get route in order to grab the variable "newitem"
    res.redirect("/")
    newItems.push(newItem);
    console.log(newItem);
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});