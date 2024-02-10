
import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const salt = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin:["login-page-backend-new.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
  host: "sql6.freesqldatabase.com", // Update host
  user: "sql6683169", // Update database user
  password: "gkWS65RG8H", // Update database password
  database: "sql6683169", // Update database name
  port: 3306 // Update port number
});

db.connect();

// Create table if not exists
const createTableQuery = `CREATE TABLE IF NOT EXISTS login1 (
    id INT(255) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    age VARCHAR(255) NOT NULL,
    dob VARCHAR(255) NOT NULL,
    contact VARCHAR(10) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("Error creating table:", err);
    } else {
        console.log("Table 'login1' created successfully");
    }
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authorized" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token Error" });
            } else {
                req.name = decoded.name;
                req.age = decoded.age;
                req.email = decoded.email;
                req.dob = decoded.dob;
                req.address = decoded.address;
                req.contact = decoded.contact;
                req.gender = decoded.gender;

                next();
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({
        Status: "Success",
        name: req.name,
        age: req.age,
        email: req.email,
        dob: req.dob,
        address: req.address,
        contact: req.contact,
        gender: req.gender
    });
});

app.post("/register", (req, res) => {
    const sql = "INSERT INTO login1 (name, gender, age, dob, contact, address, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error in hashing password" });
        const values = [req.body.name, req.body.gender, req.body.age, req.body.dob, req.body.contact, req.body.address, req.body.email, hash];
        db.query(sql, values, (err, result) => {
            if (err) return res.json({ Error: "insert error" });
            return res.json({ Status: "Success" });
        });
    });
});

app.post("/login", (req, res) => {
    const sql = "SELECT * FROM login1 WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "An error occurred while processing the login." });
        }
        if (data.length > 0) {
            bcrypt.compare(
                req.body.password.toString(),
                data[0].password,
                (err, response) => {
                    if (err) {
                        return res.status(500).json({ error: "An error occurred while comparing passwords." });
                    }
                    if (response) {
                        const name = data[0].name;
                        const email = data[0].email;
                        const age = data[0].age;
                        const dob = data[0].dob;
                        const address = data[0].address;
                        const contact = data[0].contact;
                        const gender = data[0].gender;
                        const token = jwt.sign({ name, age, email, dob, address, contact, gender }, "jwt-secret-key", { expiresIn: '1d' });
                        res.cookie('token', token);
                        return res.json({ Status: "Success" });
                    } else {
                        return res.status(401).json({ Error: "Password does not match." });
                    }
                }
            );
        } else {
            return res.status(404).json({ error: "Email not found." });
        }
    });
});

app.post("/UpdateProfile", verifyUser, (req, res) => {
    const { name, age, email, dob, address, contact, gender } = req.body;
    const sql = "UPDATE login1 SET name=?, age=?, dob=?, address=?, contact=?, gender=? WHERE email=?";
    db.query(sql, [name, age, dob, address, contact, gender, email], (err, result) => {
        if (err) return res.status(500).json({ Error: "Update error" });
        return res.json({ Status: "Success" });
    });
});

app.listen(8081, () => {
    console.log("Running...");
});
