#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');

program
  .name('jsonf')
  .description('JSON formatter and validator')
  .version('0.1.0');

program
  .argument('[file]', 'JSON file to format')
  .option('-c, --compact', 'compact output')
  .option('-i, --indent <size>', 'indentation size', '2')
  .option('--no-color', 'disable color output')
  .action((file, options) => {
    let jsonContent;
    
    if (file) {
      try {
        jsonContent = fs.readFileSync(file, 'utf8');
      } catch (error) {
        console.error(chalk.red(`Error reading file: ${error.message}`));
        process.exit(1);
      }
    } else {
      console.log(chalk.yellow('Reading from stdin...'));
      process.exit(0);
    }

    try {
      const parsed = JSON.parse(jsonContent);
      const formatted = options.compact ? 
        JSON.stringify(parsed) : 
        JSON.stringify(parsed, null, parseInt(options.indent));
      
      if (options.color !== false) {
        console.log(chalk.green('✓ Valid JSON'));
        console.log(formatJsonWithColors(formatted));
      } else {
        console.log(formatted);
      }
    } catch (error) {
      console.error(chalk.red(`Invalid JSON: ${error.message}`));
      process.exit(1);
    }
  });

function formatJsonWithColors(jsonString) {
  return jsonString
    .replace(/(".*?")/g, chalk.green('$1'))
    .replace(/(\d+)/g, chalk.cyan('$1'))
    .replace(/(true|false)/g, chalk.yellow('$1'))
    .replace(/null/g, chalk.gray('null'));
}

program.parse();