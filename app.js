import express from "express"
import axios from "axios"

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
    try{
        const response = await axios.get("https://evilinsult.com/generate_insult.php");
        console.log(response.data);
        res.render("index.ejs", {content: response.data})

    }catch(error){
        res.render("index.ejs", {content: null});
    
    }
    
})


app.listen(port, () => {
    console.log(`Server Opened at port ${port}`)
})