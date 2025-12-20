// Test script for chatbot functionality
require('dotenv').config();
const { getAvailableCarsData, needsWebSearch, performWebSearch } = require('./controllers/chatbotController');

async function test() {
  console.log('Testing chatbot functionality...\n');

  // Test car data
  const cars = await getAvailableCarsData();
  console.log('Available cars:', cars.length);
  console.log('First car:', JSON.stringify(cars[0], null, 2));

  // Test web search detection
  console.log('\nWeb search detection tests:');
  console.log('Test 1 - Car inquiry:', needsWebSearch('What cars do you have available?'));
  console.log('Test 2 - Web search:', needsWebSearch('What are the latest electric car reviews?'));
  console.log('Test 3 - Web search:', needsWebSearch('How to maintain car tires?'));
  console.log('Test 4 - Inventory query:', needsWebSearch('How much does the MG6 cost?'));

  // Test web search functionality
  console.log('\nTesting web search...');
  const searchResults = await performWebSearch('latest electric car reviews');
  if (searchResults) {
    console.log('Web search successful! Found', searchResults.length, 'results');
    console.log('First result:', searchResults[0]);
  } else {
    console.log('Web search returned no results or failed');
  }
}

test().catch(console.error);