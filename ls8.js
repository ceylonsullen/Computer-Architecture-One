/*
# mult.ls8

00000001 # initialize
00000010 # SET current register
00000000 # register R0
00000100 # SAVE next
00001000 # 8
00000010 # SET current register
00000001 # register R1
00000100 # SAVE next
00001001 # 9
00000010 # SET current register
00000010 # register R2
00000101 # MUL into current register
00000000 # register R0
00000001 # register R1  (we've computed R2 = R0 * R1)
00000010 # SET current register
00000010 # register R2
00000110 # PRN (print numeric) (should print 72)
00000000 # HALT
*/

const fs = require('fs')
const CPU = require('./CPU.js')
const args = process.argv.slice(2)

if (args.length != 1) {
    process.exit(1);
}


const fileName = args[0];


// read the input file
const readFile = (fileName) => {
    // todo : error checking
    const contents = fs.readFileSync(fileName, 'utf-8');

    return contents;
}

// load the file into current memory

const loadMemory = (cpu, contents) => {
    const lines = contents.split('\n');
    let address = 0;
    for( let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const commentIndex = line.indexOf('#')
        if (commentIndex != -1) {
            line = line.substr(0, commentIndex);
        }
        line = line.trim();
        if (line == '') {
            continue;
        }

        const val = parseInt(line, 2);
        cpu.poke(address++, val)
    }
    
}

const cpu = new CPU();
const contents = readFile(fileName);
loadMemory(cpu, contents)
console.log(cpu.mem[4])
cpu.startClock()