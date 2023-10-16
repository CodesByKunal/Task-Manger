const express = require('express');
const jwt = require('jsonwebtoken');
const { alltaskInDatabase, deleteInDatabse, insertInDatabase, updateInDatabase, createUser } = require('./module/database');
const cookieParser = require('cookie-parser');
const app = express()
const port = 3000
app.use(express.json());
app.use(cookieParser());
app.use(express.static(('public')));
app.listen(port, () => {
    console.log(`Server is active at http://localhost:3000/
    `)
})
const checkedLoggedIn = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            jwt.verify(req.cookies.jwt, 'shhhh', (err, decoded) => {
                if (!err) {
                    console.log(decoded.user)
                    next();
                } else {
                    console.log(err)
                    res.json('Err_Login')
                }
            });
        } else {
            res.json('Err_Login')
        }

    } catch (error) {
        console.log(error)
    }
}
app.post('/posttask', async (req, res) => {
    try {
        const reqdata = req.body;
        const userName = jwt.verify(req.cookies.jwt, 'shhhh', (err, decoded) => {
            if (!err) {
                return decoded.user
            } else {
                console.log(err)
            }
        });
        await insertInDatabase(reqdata, userName);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.delete('/deletetask/:taskId', async (req, res) => {
    try {
        const userName = jwt.verify(req.cookies.jwt, 'shhhh', (err, decoded) => {
            if (!err) {
                return decoded.user
            } else {
                console.log(err)
            }
        });
        const { taskId } = req.params;
        await deleteInDatabse(taskId, userName)
        res.end()
    } catch (error) {
        console.error(error)
    }
})

app.get('/alltasks', checkedLoggedIn, async (req, res) => {
    try {
        const userName = jwt.verify(req.cookies.jwt, 'shhhh', (err, decoded) => {
            if (!err) {
                return decoded.user
            } else {
                console.log(err)
            }
        });
        const tasks = await alltaskInDatabase(userName);
        res.json(tasks)
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error');
    }
})

app.patch('/priority/:id/:priority', async (req, res) => {
    try {
        const userName = jwt.verify(req.cookies.jwt, 'shhhh', (err, decoded) => {
            if (!err) {
                return decoded.user
            } else {
                console.log(err)
            }
        });
        const { id, priority } = req.params
        await updateInDatabase(id, priority, userName)
        res.end()
    } catch (error) {
        console.error(error)
    }
})

app.get('/login', async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            console.log(req.headers)
            const userName = req.header('username');
            console.log(userName)
            const token = jwt.sign({ user: userName }, 'shhhh')
            res.cookie('jwt', token);
            res.end();
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error)
    }
})

app.get('/signup', async (req, res) => {
    try {
        const userName = req.header('username')
        const token = jwt.sign({ user: userName }, 'shhhh')
        res.cookie('jwt', token);
        await createUser(userName);
        res.end();
    } catch (error) {
        console.log(error)
    }
})

//checkExistingUser