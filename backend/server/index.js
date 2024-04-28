const express = require ('express')
const cors = require ('cors')
const {Pool} = require ('pg')
require('dotenv').config()

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    allowExitOnIdle: true
});




const app = express()

app.listen(3000, () => console.log ('servidor corriendo'))

//middleware
app.use (express.json())
app.use(cors())

//ruta
app.get("/posts", async (req, res) => {
    try{
        console.log(process.env.DB_HOST);
        console.log(process.env.DB_USER);
        console.log(process.env.DB_PASSWORD);
        console.log(process.env.DB_DATABASE);
        console.log(process.env.DB_PORT);
        console.log("entre al get  ")
        const query = "SELECT * FROM posts;"
        console.log("sali de la query")
        const {rows} = await pool.query(query)
            res.json(rows)
            console.log("res "+res)
    } catch (error) {
        console.log('hay un error en el get', error.message)
    }
})

app.post("/posts", async (req, res) => {
    try {
        console.log("entre al post  ");
        const { titulo, img, descripcion } = req.body;

        if (!titulo || !img || !descripcion) {
            return res.status(400).json("Todos los campos (titulo, img, descripcion) son obligatorios.");
        }

        const id = Math.floor(Math.random() * 9999); // Aleatorio, después lo cambio
        const query = "INSERT INTO posts (id, titulo, img, descripcion, likes) VALUES($1, $2, $3, $4, $5)";
        const values = [id, titulo, img, descripcion, 0];
        const { rows } = await pool.query(query, values);
        res.json("post creado!");
    } catch (error) {
        console.log('hay un error en el post', error.message);
        res.status(500).json('Error al crear el post');
    }
});


app.delete("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params; // Obtén el ID desde la URL

        const query = "DELETE FROM posts WHERE id = $1 RETURNING *;";
        const values = [id];

        const { rows } = await pool.query(query, values);
        if (rows.length === 0) {
            res.status(404).json("Post no encontrado para eliminar.");
        } else {
            res.json(rows[0]);
            console.log("Post eliminado: ", rows[0]);
        }
    } catch (error) {
        console.log('Error en el DELETE', error.message);
        res.status(500).json('Error al eliminar el post');
    }
});


app.put("/posts/like/:id", async (req, res) => {
    try {
        console.log("dentro del put para likes");
        const { id } = req.params;

        const query = "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *;";
        const values = [id];

        const { rows } = await pool.query(query, values);
        if (rows.length === 0) {
            res.status(404).json("Post no encontrado.");
        } else {
            res.json(rows[0]);
            console.log("Likes actualizados: ", rows[0]);
        }
    } catch (error) {
        console.log('Error en el PUT para likes', error.message);
        res.status(500).json('Error al actualizar los likes del post');
    }
});

