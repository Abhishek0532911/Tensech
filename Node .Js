const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const pantryData = {};

app.use(bodyParser.json());

// Create (POST) 
app.post('/add-item', (req, res) => {
  const { pantry_id, basket_key, value } = req.body;

  if (pantry_id && basket_key && value) {
    const pantryKey = `${pantry_id}:${basket_key}`;
    pantryData[pantryKey] = value;
    res.json({ message: 'Item added successfully' });
  } else {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// Read (GET) 
app.get('/get-item', (req, res) => {
  const { pantry_id, basket_key } = req.query;

  if (pantry_id && basket_key) {
    const pantryKey = `${pantry_id}:${basket_key}`;
    if (pantryKey in pantryData) {
      res.json({ value: pantryData[pantryKey] });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } else {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// List Baskets (GET) 
app.get('/list-baskets', (req, res) => {
  const { pantry_id, filter_name } = req.query;

  if (pantry_id) {
    let baskets = Object.keys(pantryData)
      .filter((key) => key.startsWith(`${pantry_id}:`))
      .map((key) => key.split(':')[1]);

    if (filter_name) {
      baskets = baskets.filter((basket) => basket.includes(filter_name));
    }

    res.json({ baskets });
  } else {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// Update (PUT) 
app.put('/update-item', (req, res) => {
  const { pantry_id, basket_key, value } = req.body;

  if (pantry_id && basket_key && value) {
    const pantryKey = `${pantry_id}:${basket_key}`;
    if (pantryKey in pantryData) {
      pantryData[pantryKey] = value;
      res.json({ message: 'Item updated successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } else {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// Delete (DELETE) 
app.delete('/delete-item', (req, res) => {
  const { pantry_id, basket_key } = req.query;

  if (pantry_id && basket_key) {
    const pantryKey = `${pantry_id}:${basket_key}`;
    if (pantryKey in pantryData) {
      delete pantryData[pantryKey];
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } else {
    res.status(400).json({ error: 'Invalid input' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

