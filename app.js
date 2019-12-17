// DEPENDENCIES 
const   express             = require("express"),
        app                 = express(),
        methodOverride      = require("method-override"),
        expressSanitizer    = require("express-sanitizer"),
        bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"),
        PORT                = process.env.PORT || 3000;

// Connect to mongoose server
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/restful_note_taker_app", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

// App config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Schema for note
const noteSchema = new mongoose.Schema({
    title: String,
    message: String,
    created: { type: Date, default: Date.now}
});

const Note = mongoose.model("Note", noteSchema);

// REROUTE TO /notes
app.get("/", (req, res) => {
    res.redirect("/notes");
});

// INDEX ROUTE
app.get("/notes", (req, res) => {
    Note.find({}, function (err, notes) {
        if (err) console.log(err);
        res.render("index", { notes: notes });
    });
});

// NEW ROUTE
app.get("/notes/new", (req, res) => {
    res.render("new");
});

// CREATE ROUTE
app.post("/notes", (req, res) => {
    req.body.note.body = req.sanitize(req.body.note.body);
    Note.create(req.body.note, function (err, newNote) {
        if (err) res.render("new");
        res.redirect("/notes");
    });
});

// SHOW ROUTE
app.get("/notes/:id", (req, res) => {
    Note.findById(req.params.id, function (err, foundNote) {
        if (err) res.redirect("/notes");
        res.render("show", {
            note: foundNote
        });
    });
});

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT + "...");
})