const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.set("view engine", 'ejs');

app.get("/", (req, res) => {

    var today = new Date();
    var currentDay = today.getDay();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    var day = today.toLocaleDateString("en-US",options);
    console.log(day)

    res.render("list", {
        kindOfDay: day
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});