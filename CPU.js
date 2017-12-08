const INIT = 0b00000001;
const SET  = 0b00000010;
const SAVE = 0b00000100;
const MUL =  0b00000101;
const ADD =  0b00001001;
const SUB =  0b00010001;
const DIV =  0b00100001;
const PRN =  0b00000110;
const HALT = 0b00000000;

class CPU {
    constructor() {
        this.mem = new Array(256);
        this.mem.fill(0);
        this.reg = new Array(256);
        this.reg.fill(0);

        this.reg.PC = 0;
        this.curReg = 0;
        this.buildBranchTable();
    }

    buildBranchTable() {
        let bt = {
            [INIT] : this.INIT,
            [SET] : this.SET,
            [SAVE] : this.SAVE,
            [MUL] : this.MUL,
            [PRN] : this.PRN,
            [HALT] : this.HALT,
            [ADD] : this.ADD,
            [SUB] : this.SUB,
            [DIV] : this.DIV,
        };

        this.branchTable = bt;
        
    }

    // poke values into memory
    poke(address, value) {
        this.mem[address] = value;
    }

    // start the clock
    startClock() {
        this.clock = setInterval(() => { this.tick() }, 1000)
    }

    stopClock() {
        clearInterval(this.clock)
    }

    //each tick of the clock
    tick() {
        // Run the instructions
        const currentInstruction = this.mem[this.reg.PC];

        const handler = this.branchTable[currentInstruction];

        if (handler === undefined) {
            console.error("ERROR: invalid instruction " + currentInstruction);
            this.stopClock();
            return;
        }

        handler.call(this);  // set this explicitly in handler
    }

    INIT() {
        console.log('INIT')
        this.reg.PC = this.reg.PC + 1;
        console.log(this.reg.PC)
    }

    SET() {
        console.log(this.mem[1], this.mem[2], this.mem[3], this.mem[4], this.mem[5])
        console.log(this.mem[3], this.reg.PC)
        const reg = this.mem[this.reg.PC + 1]
        this.curReg = reg;
        console.log('SET ' + reg)
        this.reg.PC += 2;
        console.log(this.mem[4])
    }
    
    SAVE() {
        console.log(this.mem[4])
        const val = this.mem[this.reg.PC + 1]
        console.log(this.mem[4], this.reg.PC + 1)
        console.log("save", val)
        this.reg[this.curReg] = val & 0xff;
        this.reg.PC += 2
    }
    MUL() {
        const val = this.reg[this.mem[this.reg.PC + 1]] * this.reg[this.mem[this.reg.PC + 2]]
        console.log("MUL ", this.reg[this.mem[this.reg.PC + 1]], " and ", this.reg[this.mem[this.reg.PC + 2]] )
        this.reg[this.curReg] = val & 0xff;
        console.log(val)
        this.reg.PC += 3;
        
    }

    ADD() {
        const val = this.reg[this.mem[this.reg.PC + 1]] + this.reg[this.mem[this.reg.PC + 2]]
        console.log("ADD ", this.reg[this.mem[this.reg.PC + 1]], " and ", this.reg[this.mem[this.reg.PC + 2]] )
        this.reg[this.curReg] = val & 0xff;
        console.log(val)
        this.reg.PC += 3;
    }

    SUB() {
        const val = this.reg[this.mem[this.reg.PC + 1]] - this.reg[this.mem[this.reg.PC + 2]]
        console.log("SUB ", this.reg[this.mem[this.reg.PC + 1]], " and ", this.reg[this.mem[this.reg.PC + 2]] )
        this.reg[this.curReg] = val & 0xff;
        console.log(val)
        this.reg.PC += 3;
    }

    DIV() {
        const val = this.reg[this.mem[this.reg.PC + 1]] / this.reg[this.mem[this.reg.PC + 2]]
        console.log("DIV ", this.reg[this.mem[this.reg.PC + 1]], " and ", this.reg[this.mem[this.reg.PC + 2]] )
        this.reg[this.curReg] = val & 0xff;
        console.log(val)
        this.reg.PC += 3;
    }
    PRN() {
        console.log(this.reg[this.curReg])
        this.reg.PC++;
    }

    HALT() {
        this.stopClock();
    }
}

module.exports = CPU;