// Importing Express
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'config/.env' })

const userRoutes = require('./routes/users');
const authenticationRoutes = require('./routes/authentication');

// Importing Secondary Packages
const cors = require('cors');
const { sequelize } = require('./database');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/users', userRoutes);
app.use('/auth', authenticationRoutes);

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server Listening on Port: 3000");
        });
    })
    .catch(err => {
        console.error("Failed to Sync Database: ", err);
    }
);