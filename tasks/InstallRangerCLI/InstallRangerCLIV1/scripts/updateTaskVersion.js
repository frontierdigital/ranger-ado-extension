#!/bin/env node

const fs = require('fs');
const path = require('path');

const packageDefinition = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

const taskDefinition = JSON.parse(fs.readFileSync(path.join(__dirname, '../task.json'), 'utf8'));
taskDefinition.version = {
  Major: parseInt(packageDefinition.version.split('.')[0], 10),
  Minor: parseInt(packageDefinition.version.split('.')[1], 10),
  Patch: parseInt(packageDefinition.version.split('.')[2], 10),
};

fs.writeFileSync(path.join(__dirname, '../task.json'), JSON.stringify(taskDefinition, null, 2));
