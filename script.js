const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors module

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use cors middleware to allow requests from any origin

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/budgeting', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Create Income schema
const incomeSchema = new mongoose.Schema({
  description: String,
  amount: Number
});

// Create Expense schema
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number
});

// Create Income model
const Income = mongoose.model('Income', incomeSchema);

// Create Expense model
const Expense = mongoose.model('Expense', expenseSchema);

// Define a basic route for the root URL
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to add a new income
app.post('/api/incomes', (req, res) => {
  const { description, amount } = req.body;
  if (description && !isNaN(amount) && amount > 0) {
    const newIncome = new Income({ description, amount });
    newIncome.save()
      .then(() => res.sendStatus(201))
      .catch((err) => res.status(500).send(err));
  } else {
    res.status(400).send('Invalid income data');
  }
});

// Route to add a new expense
app.post('/api/expenses', (req, res) => {
  const { description, amount } = req.body;
  if (description && !isNaN(amount) && amount > 0) {
    const newExpense = new Expense({ description, amount });
    newExpense.save()
      .then(() => res.sendStatus(201))
      .catch((err) => res.status(500).send(err));
  } else {
    res.status(400).send('Invalid expense data');
  }
});

// Route to get all incomes
app.get('/api/incomes', (req, res) => {
  Income.find()
    .then((incomes) => res.json(incomes))
    .catch((err) => res.status(500).send(err));
});

// Route to get all expenses
app.get('/api/expenses', (req, res) => {
  Expense.find()
    .then((expenses) => res.json(expenses))
    .catch((err) => res.status(500).send(err));
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
