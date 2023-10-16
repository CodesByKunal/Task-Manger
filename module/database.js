const { MongoClient } = require('mongodb')
require('dotenv').config()
const uri = process.env.URI
console.log(uri)
const client = new MongoClient(uri)
const dbname = 'taskManager';

const connectTodatabase = async () => {
    try {
        await client.connect()
        console.log(`Connected to ${dbname}`)
    } catch (error) {
        console.error(`Unable to connect ${error}`)
    }
}

const createUser = async (newUser) => {
    try {
        await client.connect();
        await client.db(dbname).createCollection(newUser)
    } catch (error) {
        console.log(error)
    }
}

const insertInDatabase = async (reqdata, userName) => {
    try {
        await connectTodatabase();
        await client.db(dbname).collection(userName).insertOne(reqdata);
    } catch (error) {
        console.error(`Unable to find ${error}`)
    } finally {
        await client.close()
    }
}

const deleteInDatabse = async (taskId, userName) => {
    try {
        await connectTodatabase();
        let result = await client.db(dbname).collection(userName).deleteOne({ id: `${taskId}` });
        console.log(result.deletedCount)
    } catch (error) {
        console.error(`Unable to delete ${error}`)
    } finally {
        await client.close();
    }
}

const alltaskInDatabase = async (userName) => {
    try {
        await connectTodatabase();
        let cursor = client.db(dbname).collection(userName).find()
        let tasks = await cursor.toArray()
        return tasks
    } catch (error) {
        console.error(error)
    } finally {
        await client.close()
    }
}

const updateInDatabase = async (id, priority, userName) => {
    try {
        await connectTodatabase();
        const tobeupdated = { id: `${id}` }
        const updatedvalue = { $set: { priority: `${priority}` } }
        await client.db(dbname).collection(userName).updateOne(tobeupdated, updatedvalue)
    } catch (error) {
        console.error(error)
    } finally {
        await client.close()
        console.log('Disconcted to databse')
    }
}
module.exports = {
    alltaskInDatabase,
    deleteInDatabse,
    insertInDatabase,
    updateInDatabase,
    createUser
}
