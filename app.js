const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const {
    isBuffer
} = require("util");

const app = express();

app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    name: String,
}

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Buy food"
});


const item2 = new Item({
    name: "cook food"
});


const item3 = new Item({
    name: "Eat food"
});

const defaultItems = [item1, item2, item3];



app.get("/", (req, res) => {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfull");
                }
            });
        } else {
            res.render("list", {
                listTitle: "Toaday",
                newItems: foundItems

            });
        }
    });



});



app.post("/", (req, res) => {

    const newItem = req.body.newItem;

    const item = new Item({
        name: newItem,
    });

    item.save();
    res.redirect("/");
    // The code above points to the get route in order to grab the variable "newitem"


});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function (err) {
        if (!err) {
            console.log("Delete successsfull");
            res.redirect("/");
        }
    })
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