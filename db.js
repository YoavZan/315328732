const mysql = require("mysql2");
const dbConfig = require('./db.config.js');
// Create a connection to the database

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
});

// open the MySQL connection
connection.connect(error => {
    if (error) throw  "cannot connect to db: "+error.message;
    console.log("Successfully connected to the database.");
    init_db();
});

const init_db = () =>{
    connection.query("CREATE DATABASE IF NOT EXISTS mydog", (err, mysqlres) => {
        if (err) {
            console.error("error: ", err);
            return;
        }
        console.log(`created database`);
    });

    connection.query("USE mydog", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return;
        }
        console.log(`selected database`);
    });

    connection.query("CREATE TABLE IF NOT EXISTS dogs (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), breed VARCHAR(255), gender VARCHAR(255), age VARCHAR(255), size VARCHAR(255), city VARCHAR(255), inquiries INT)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return;
        }
        console.log(`created dogs table`);
    })

    connection.query("CREATE TABLE IF NOT EXISTS adoptions (id INT AUTO_INCREMENT PRIMARY KEY, dog_id INT,  FOREIGN KEY (dog_id) REFERENCES dogs(id),first_name VARCHAR(255),last_name VARCHAR(255),email VARCHAR(255),phone VARCHAR(255) )", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return;
        }
        console.log(`created adoptions table`);
    })

}
const create_database = (req, res) => {
    connection.query("CREATE DATABASE IF NOT EXISTS mydog", (err, mysqlres) => {
        if (err) {
            res.status(400).send({
                message: "error in creating database: " + err
            });
            return;
        }
        console.log(`created database`);
    });

    //select database
    connection.query("USE mydog", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in selecting database: " + err
            });
        }
        console.log(`selected database`);
        res.send("Created database");

    });

    console.log(`Finished create database`);
}

const delete_database = (req, res) => {
    connection.query("DROP DATABASE mydog", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in deleting database: " + err
            });
            return;
        }
        console.log(`deleted database`);
    });
    res.send("Deleted database");
    return;
}

const search_dogs = (req, res) => {
    const {breed,gender,age,size,city} = req.query;
    console.log(breed);

    var query = "SELECT * FROM dogs";
    var params = [];
    
    if (breed != "undefined") {
        query += (params.length > 0) ? ' AND' : ' WHERE';

        params.push(breed);
        query += " breed LIKE ?";
    }
    if(gender!= "undefined"){
        query += (params.length > 0) ? ' AND' : ' WHERE';

        params.push(gender);
        query+= " gender LIKE ?";
    }
    if(age!= "undefined"){
        query += (params.length > 0) ? ' AND' : ' WHERE';

        params.push(age);
        query+= " age LIKE ?";
    }
    if(size!= "undefined"){
        query += (params.length > 0) ? ' AND' : ' WHERE';

        params.push(size);
        query+= " size LIKE ?";
    }
    if(city!= "undefined"){
        query += (params.length > 0) ? ' AND' : ' WHERE';

        params.push(city);
        query+= " city LIKE ?";
    }
    connection.query(query, params, (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in selecting dogs table: " + err
            });
            return;
        }
        res.send(mysqlres);
    })
}

const create_dogs_table = (req, res) => {
    connection.query("CREATE TABLE IF NOT EXISTS dogs (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), breed VARCHAR(255), gender VARCHAR(255), age VARCHAR(255), size VARCHAR(255), city VARCHAR(255), inquiries INT)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in creating dogs table: " + err
            });
        }
        return res.send("Created dogs table");
    })
}

const create_adoptions_table = (req, res) => {
    connection.query("CREATE TABLE IF NOT EXISTS adoptions (id INT AUTO_INCREMENT PRIMARY KEY, dog_id INT,  FOREIGN KEY (dog_id) REFERENCES dogs(id),first_name VARCHAR(255),last_name VARCHAR(255),email VARCHAR(255),phone VARCHAR(255) )", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);

            return res.status(400).send({
                message: "error in creating adoptions table: " + err
            });
        }
    })
}

const insert_into_dogs_table = (req, res) => {
    const csvFilePath = 'dogs.csv'
    const csv = require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            for (let i = 0; i < jsonObj.length; i++) {
                jsonObj[i].inquiries = 0;
                connection.query("INSERT INTO dogs SET ?", jsonObj[i], (err, mysqlres) => {
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({
                            message: "error in inserting to dogs table: " + err
                        });
                    }
                })
            }
        })
    //send OK
    res.send("OK");
}

const insert_into_adoptions_table = (req, res) => {
    const csvFilePath = 'adoptions.csv'
    const csv = require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            for (let i = 0; i < jsonObj.length; i++) {
                connection.query("INSERT INTO adoptions SET ?", jsonObj[i], (err, mysqlres) => {
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({
                            message: "error in inserting to adoptions table: " + err
                        });
                    }
                })
                connection.query("UPDATE dogs SET inquiries = inquiries + 1 WHERE id = ?", jsonObj[i].dog_id, (err, mysqlres) => {
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({
                            message: "error in updating dogs table: " + err
                        });
                    }
                }
                )
            }
        })
    res.send("OK");
}

const i_want_to_adopt = (req, res) => {
    const { dog_id, first_name, last_name, email, phone } = req.body;
    
    if (!dog_id || !first_name || !last_name || !email || !phone) {
        return res.status(400).send({
            message: "dog_id, first_name, last_name, email, phone are required"
        });
    }
    var email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email_regex.test(email)) {
        return res.status(400).send({
            message: "email is not valid"
        });
    }
    if (phone.length !== 10) {    
        return res.status(400).send({
            message: "phone is not valid"
        });
    }

    connection.query("INSERT INTO adoptions (dog_id, first_name, last_name, email, phone) VALUES (?,?,?,?,?)", [dog_id, first_name, last_name, email, phone], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({

                message: "error in inserting to adoptions table: " + err
            });
        }
        connection.query("UPDATE dogs SET inquiries = inquiries + 1 WHERE id = ?", dog_id, (err, mysqlres) => {
            if (err) {
                console.log("error: ", err);
                return res.status(400).send({
                    message: "error in updating dogs table: " + err
                });
            }
        })
        res.send("OK");
    })
}

const select_dogs_table = (req, res) => {
    connection.query("SELECT * FROM dogs", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in selecting dogs table: " + err
            });
        }
        res.send(mysqlres);
    })
}

const select_adoptions_table = (req, res) => {
    connection.query("SELECT * FROM adoptions", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in selecting adoptions table: " + err
            });
        }
        res.send(mysqlres);
    })
}

const drop_tables = (req, res) => {

    connection.query("DROP TABLE adoptions", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in dropping adoptions table: " + err
            });
        }
    })
    connection.query("DROP TABLE dogs", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in dropping dogs table: " + err
            });
        }
    })
    res.send("dropped tables");
}

module.exports = {
    create_database,
    create_dogs_table,
    create_adoptions_table,
    insert_into_dogs_table,
    insert_into_adoptions_table,
    select_dogs_table,
    select_adoptions_table,
    drop_tables,
    delete_database,
    search_dogs,
    i_want_to_adopt
}
 