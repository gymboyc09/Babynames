const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'babynames';

async function importNames() {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection('names');
    
    // Read CSV file
    const csvPath = path.join(__dirname, '..', 'Babynames.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV and extract names
    const lines = csvContent.split('\n');
    const names = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        // Split by comma and take the first column (name)
        const columns = trimmedLine.split(',');
        const name = columns[0].trim();
        
        if (name && name.length > 0) {
          names.push({
            name: name,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }
    
    console.log(`Found ${names.length} names to import`);
    
    // Clear existing names collection
    await collection.deleteMany({});
    console.log('Cleared existing names');
    
    // Insert all names
    if (names.length > 0) {
      await collection.insertMany(names);
      console.log(`Successfully imported ${names.length} names`);
    }
    
    // Create index on name field for faster searches
    await collection.createIndex({ name: 1 });
    console.log('Created index on name field');
    
  } catch (error) {
    console.error('Error importing names:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

// Run the import
importNames();
