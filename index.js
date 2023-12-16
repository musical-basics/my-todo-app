const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const TaskSchema = new mongoose.Schema({
    title: String,
    isCompleted: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', TaskSchema);

app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).send(newTask);
});

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
});

mongoose.connect('mongodb://localhost:27017/todoDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3001, () => console.log('Server running on http://localhost:3001')))
    .catch(err => console.error(err));
