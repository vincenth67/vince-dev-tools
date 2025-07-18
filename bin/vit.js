#!/usr/bin/env node

const { routeCommand } = require('../lib/index.js');

// Get command line arguments (skip first two: node path and script path)
const args = process.argv.slice(2);

// Route the command (support async)
(async () => {
  await require('../lib/index.js').routeCommand(args);
})(); 