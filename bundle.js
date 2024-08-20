const fs = require('fs');        
const UglifyJS = require('uglify-js');  

let minifyThis = false;      
let outputFileName = 'output.js'; 
let listOfFilesToCombine = [];   


function displayHelpMessage() {
  console.log(`
Usage: node bundle.js [options] [file1.js file2.js ...]

Options:
  --minify         Minify the JavaScript output
  --out <file>     Specify the output file path
  --help           Show this help message
  `);
}


for (let index = 2; index < process.argv.length; index++) {
  const argument = process.argv[index];

  if (argument === '--minify') {
    minifyThis
   = true;  
  } else if (argument === '--out') {
    outputFileName = process.argv[++index];
  } else if (argument === '--help') {
    displayHelpMessage(); 
    return;              
  } else {
    listOfFilesToCombine.push(argument);  
  }
}


function combineAllFiles(files) {
  let combinedCode = ''; 

  files.forEach(file => {
    if (fs.existsSync(file)) {
      const fileContent = fs.readFileSync(file, 'utf-8'); 
      combinedCode += fileContent ;  
    } else {
      console.error(`File not found: ${file}`);
    }
  });

  return combinedCode;
}


let finalCode = combineAllFiles(listOfFilesToCombine);


if (minifyThis

) {
  const minifiedOutput = UglifyJS.minify(finalCode);
  if (minifiedOutput.error) {
    console.error('Error during minification:', minifiedOutput.error);
  } else {
    finalCode = minifiedOutput.code;  
  }
}


fs.writeFileSync(outputFileName, finalCode, 'utf-8');
console.log(`Combined ${listOfFilesToCombine.length} files into ${outputFileName}`);
