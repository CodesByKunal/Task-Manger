const express = require('express')
const { alltaskInDatabase, deleteInDatabse, insertInDatabase, updateInDatabase } = require('./module/database');
const app = express()
const port = 3000
app.use(express.json());
app.use(express.static(('public')));
app.listen(port, () => {
    console.log(`Server is active at http://localhost:3000/
    `)
})
app.post('/posttask', async (req, res) => {
    try {
        const reqdata = req.body;
        await insertInDatabase(reqdata);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.delete('/deletetask/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        await deleteInDatabse(taskId)
        res.end()
    } catch (error) {
        console.error(error)
    }
})

app.get('/alltasks', async (req, res) => {
    try { 
        const tasks = await alltaskInDatabase();
        res.json(tasks)
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error');
    }
})

app.patch('/priority/:id/:priority', async (req, res) => {
    try {
        const { id, priority } = req.params
        await updateInDatabase(id, priority)
        res.end()
    } catch (error) {
        console.error(error)
    }
})
