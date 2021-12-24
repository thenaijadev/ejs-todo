const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const {
    isBuffer
} = require("util");
const { listen } = require("express/lib/application");

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

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

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
                listTitle: "Today",
                newItems: foundItems

            });
        }
    });



});
 
app.post("/", (req, res) => {

    const newItem = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: newItem,
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName)
        })
    }

   
    // The code above points to the get route in order to grab the variable "newitem"


});



app.get("/:CustomListName", (req, res) => {
    const customListName = _.capitalize(req.params.CustomListName);

    List.findOne({
        name: customListName
    }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                //create new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                }); 
                list.save();
                res.redirect("/"+ customListName);
            } else {
                //show existing list
                res.render("list", {
                    listTitle: foundList.name,
                    newItems: foundList.items
                })
            }
        }
    })

});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("Delete successsfull");
                res.redirect("/");
            }
        });
    } else {
       List.findByIdAndUpdate({
            name: listName
        }, {
            $pull: {
                items: {
                    _id: checkedItemId,
                }
            }
        }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }


});

app.post("/work", (req, res) => {
    let newWorkItem = req.body.newWorkItem;
    workItems.push(newWorkItem);
    res.redirect("/work");
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});