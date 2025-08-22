import express from "express";
import axios from "axios";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Setting and connecting to the database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "insults",
    password: "Migloleoj04!",
    port: 5432,
});

db.connect()
    .then(() => console.log("Connected to the database"))
// ---------------------------------------------------------------


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Get route for the home page
app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://evilinsult.com/generate_insult.php");
        // const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        console.log(response.data);
        res.render("index.ejs", { content: response.data});
        
    } catch (error) {
        res.render("index.ejs", { content: null });
    }
})
// ----------------------------------------------------------------

// Post route to save the insult to the database
app.post("/save", async (req, res)=>{
    const insult = req.body.insult;
    //console.log(insult); 
    try {
        // Check if the insult is already in the database
        const checkInsult = await db.query("SELECT * FROM roast WHERE joke = $1", [insult]);
        if (checkInsult.rows.length > 0) {
            console.log("Insult already exists in the database.");  
            return res.redirect("/");
        }
        // Insert the insult into the database
        const addInsult = await db.query("INSERT INTO roast (joke) VALUES ($1)", [insult]);
} catch (error) {
        console.error("Error saving insult to the database:", error);
        res.status(500).send("Error saving insult");
    }
    res.redirect("/");
})
// ----------------------------------------------------------------



// app.get("/", async (req, res) => {
//     try{
//         const response = await axios.get("https://evilinsult.com/generate_insult.php");
//         console.log(response.data);
//         res.render("index.ejs", {content: response.data})

//     }catch(error){
//         res.render("index.ejs", {content: null});
    
//     }
    
// })


app.listen(port, () => {
    console.log(`Server Opened at port ${port}`)
})