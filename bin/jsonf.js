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
  .option('--validate-only', 'only validate JSON, don\'t format')
  .option('-s, --sort-keys', 'sort object keys alphabetically')
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
      let stdinData = '';
      process.stdin.setEncoding('utf8');
      
      process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
          stdinData += chunk;
        }
      });
      
      process.stdin.on('end', () => {
        if (!stdinData.trim()) {
          console.error(chalk.red('No input provided'));
          process.exit(1);
        }
        processJson(stdinData, options);
      });
      
      return;
    }

    processJson(jsonContent, options);
  });

function processJson(jsonContent, options) {
  try {
    let parsed = JSON.parse(jsonContent);
    
    if (options.validateOnly) {
      console.log(chalk.green('✓ JSON is valid'));
      return;
    }
    
    if (options.sortKeys) {
      parsed = sortObjectKeys(parsed);
    }
    
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
}

function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === 'object') {
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = sortObjectKeys(obj[key]);
    });
    return sorted;
  }
  return obj;
}

function formatJsonWithColors(jsonString) {
  return jsonString
    .replace(/("(?:[^"\\]|\\.)*")\s*:/g, chalk.blue('$1') + chalk.white(':'))
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': ' + chalk.green('$1'))
    .replace(/:\s*(-?\d+\.?\d*)/g, ': ' + chalk.cyan('$1'))
    .replace(/:\s*(true|false)/g, ': ' + chalk.yellow('$1'))
    .replace(/:\s*(null)/g, ': ' + chalk.gray('$1'))
    .replace(/([{}[\],])/g, chalk.magenta('$1'));
}

program.parse();