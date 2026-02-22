#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const strip = require('strip-comments');
const emojiRegex = require('emoji-regex');
const packageJson = require('./package.json'); 


program
  .name('rmshii')
  .description('A CLI tool to clean AI-generated code by removing comments and emojis.')
  .version(packageJson.version) 
  .argument('[target]', 'Target directory or file to clean (defaults to current directory)') 
  .option('-c, --comments', 'Remove code comments (single and multi-line)')
  .option('-e, --emoji', 'Remove all emojis')
  .option('-a, --all', 'Remove both comments and emojis')
  .addHelpText('after', `
  
Example usage:
  $ npx rmshii -c             # Clean comments in the current folder
  $ npx rmshii -e src/        # Clean emojis only in the 'src' folder
  $ npx rmshii -a app.js      # Clean everything in 'app.js' specifically
  `)
  .showHelpAfterError() 
  .parse(process.argv);

const options = program.opts();


const removeComments = options.all || options.comments;
const removeEmojis = options.all || options.emoji;

if (!removeComments && !removeEmojis) {
  console.log('Please specify what to remove: -c (comments), -e (emojis), or -a (all)');
  process.exit(1);
}


const EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.py', '.html', '.css', '.json'];


function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (removeComments) {
    const strippedContent = strip(content);
    if (content !== strippedContent) {
      content = strippedContent;
      changed = true;
    }
  }

  if (removeEmojis) {
    const regex = emojiRegex();
    const noEmojiContent = content.replace(regex, '');
    if (content !== noEmojiContent) {
      content = noEmojiContent;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned: ${filePath}`);
  }
}


function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    
    if (file === 'node_modules' || file.startsWith('.')) {
      continue;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      if (EXTENSIONS.includes(path.extname(fullPath))) {
        processFile(fullPath);
      }
    }
  }
}


const targetArg = program.args[0] || '.';
const targetPath = path.resolve(process.cwd(), targetArg);


if (!fs.existsSync(targetPath)) {
  console.error(` Error: The path "${targetArg}" does not exist.`);
  process.exit(1);
}

const stats = fs.statSync(targetPath);

if (stats.isDirectory()) {
  console.log(` Scanning directory: ${targetPath}...`);
  walkDir(targetPath);
} else if (stats.isFile()) {
  console.log(` Scanning file: ${targetPath}...`);
  
  if (EXTENSIONS.includes(path.extname(targetPath))) {
    processFile(targetPath);
  } else {
    console.log(`  Skipped: "${targetArg}" is not a supported file type.`);
  }
}

console.log(' Cleanup complete!');