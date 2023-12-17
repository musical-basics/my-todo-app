const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const TaskSchema = new mongoose.Schema({
    title: String,
    isCompleted: { type: Boolean, default: false },
    order: Number // Add this line
});


const Task = mongoose.model('Task', TaskSchema);

app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    console.log("Adding new task:", newTask.title);
    await newTask.save();
    res.status(201).send(newTask);
});

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).send();
        }
        res.send(deletedTask);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        res.send(updatedTask);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.put('/tasks/complete/:id', async (req, res) => {
    try {
        const completedTask = await Task.findByIdAndUpdate(req.params.id, { isCompleted: true }, { new: true });
        if (!completedTask) {
            return res.status(404).send();
        }
        res.send(completedTask);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.put('/tasks/uncomplete/:id', async (req, res) => {
    try {
        const uncompletedTask = await Task.findByIdAndUpdate(req.params.id, { isCompleted: false }, { new: true });
        if (!uncompletedTask) {
            return res.status(404).send();
        }
        res.send(uncompletedTask);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/tasks/reorder', async (req, res) => {
    try {
        const newOrder = req.body;
        for (let i = 0; i < newOrder.length; i++) {
            await Task.findByIdAndUpdate(newOrder[i], { order: i });
        }
        res.send({ message: 'Tasks reordered successfully' });
    } catch (error) {
        console.error("Reorder error:", error);
        res.status(500).send(error);
    }
});







mongoose.connect('mongodb://localhost:27017/todoDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3001, () => console.log('Server running on http://localhost:3001')))
    .catch(err => console.error(err));
