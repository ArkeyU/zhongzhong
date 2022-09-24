const fs = require('fs');

const data = fs.readFileSync('data/cedict_ts.u8', 'utf8');
const writeStream = fs.createWriteStream('data/cedict.idx');

const lines = data.split("\n");
const dict = {};

let index = 0;

for (let line of lines) {
  if (line[0] == "#" || line == "") {
    index += line.length + 1;
    continue;
  }
  let spacepos = line.indexOf(' ');
  let firstentry = line.substring(0, spacepos);
  let spacepos2 = line.indexOf(' ', spacepos + 1);
  let secondentry = line.substring(spacepos + 1, spacepos2);
  
  if (firstentry == secondentry) {
    saveToDict(firstentry, index);
  } else {
    saveToDict(firstentry, index)
    saveToDict(secondentry, index);
  }
  
  index += line.length + 1;
  
}

function saveToDict(key, value) {
  if (!dict[key]) {
    dict[key] = [];
  }
  dict[key].push(value);
}

let array = [];

for (let [key, value] of Object.entries(dict)) {
  let newline = key;
  for (let entry of value) {
      newline += ',' + entry;
  }
  newline += '\n';
  array.push(newline);
}

array.sort();
for (let entry of array) {
  writeStream.write(entry);
}

writeStream.on('finish', () => {
  console.log("donut");
});

writeStream.on('error', (err) => {
  console.error("There was an error while writing");
  console.error(err);
});

writeStream.end();