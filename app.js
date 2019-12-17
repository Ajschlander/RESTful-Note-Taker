// DEPENDENCIES 
const   express             = require("express"),
        app                 = express(),
        methodOverride      = require("method-override"),
        expressSanitizer    = require("express-sanitizer"),
        bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"),
        PORT                = process.env.PORT || 3000;

// Connect to mongoose server
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/restful_blog_app", {
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

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT + "...");
})