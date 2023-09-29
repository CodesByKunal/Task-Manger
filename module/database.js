const { MongoClient } = require('mongodb')
require('dotenv').config()
const uri=process.env.URI
console.log(uri)
const client = new MongoClient(uri)
const dbname = 'mydatabase'
const collection_name = 'tasklist'
const tasklistconnection = client.db(dbname).collection(collection_name)
const connectTodatabase = async () => {
    try {
        await client.connect()
        console.log(`Connected to ${dbname}`)
    } catch (error) {
        console.error(`Unable to connect ${error}`)
    }
}

const insertInDatabase = async (reqdata) => {
    try {
        await connectTodatabase();
        await tasklistconnection.insertOne(reqdata);
    } catch (error) {
        console.error(`Unable to find ${error}`)
    } finally {
        await client.close()
    } 
}

const deleteInDatabse = async (taskId) => {
    try {
        await connectTodatabase();
        let result=await tasklistconnection.deleteOne({id:`${taskId}`});
        console.log(result.deletedCount)
    } catch (error) {
        console.error(`Unable to delete ${error}`)
    } finally {
        await client.close();
    }
}

const alltaskInDatabase = async () => {
    try {
        await connectTodatabase();
        let cursor = tasklistconnection.find()
        let tasks = await cursor.toArray()
        return tasks
    } catch (error) {
        console.error(error)
    } finally {
        await client.close()
    }
}

const updateInDatabase = async (id, priority) => {
    try {
        await connectTodatabase();
        const tobeupdated = { id: `${id}` }
        const updatedvalue = { $set: { priority: `${priority}` } }
        await tasklistconnection.updateOne(tobeupdated, updatedvalue)
    } catch (error) {
        console.error(error)
    }finally{
        await client.close()
        console.log('Disconcted to databse')
    }
}
module.exports = {
    alltaskInDatabase,
    deleteInDatabse,
    insertInDatabase,
    updateInDatabase
}
