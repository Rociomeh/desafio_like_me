const express = require ('express')
const cors = require ('cors')
const {Pool} = require ('pg')
//require('dotenv').config()

const pool = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: 'h0lA', //password: process.env.PASSWORD //esto hace que el archivo env no se suba a git, y por ende no se muestre la contraseña
    database: 'likeme',
    allowExitOnIdle: true

})

const app = express()

app.listen(3000, () => console.log ('servidor corriendo'))

//middleware
app.use (express.json())
app.use(cors())

//ruta
app.get("/get", async (req, res) => {
    try{
        console.log("entre al get  ")
        const query = "SELECT * FROM posts;" //llama tabla de base de datos
        console.log("sali de la query")
        const {rows} = await pool.query(query)
            res.json(rows)
            console.log("res "+res)
    } catch (error) {
        console.log('hay un error', error.message)
    }
})

app.post("/posts", async (req, res) => {
    try{
        console.log("entre al post  ")
        const {titulo, url, descripcion}= req.body
        const id = Math.floor(Math.random() * 9999) //aleatorio, despues lo cambio
        const query = "INSERT INTO posts (id, titulo, img, descripcion, likes) VALUES($1, $2, $3, $4, $5)"
        const VALUES = [id, titulo, url, descripcion, 0]
        const {rows} = await pool.query(query, VALUES)
        res.json("post creado!")
    } catch (error) {
        console.log('hay un error', error.message)
    }
})