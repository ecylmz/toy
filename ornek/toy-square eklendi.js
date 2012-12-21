HOW_MANY_VARIABLE_SHOWED = 8;
INSTRUCTION_LIMIT = 5000;

label = new Object();
opcode = new Object();
adr = new Object();
prog = new Object();
symtab = new Object();
mem = new Object();
vartab = new Object();
accumulator = null;
varindex = null;
pc = null;

sloccount = 0;

function assemble() {
	var i;
	prog = document.f.src.value.split(/[\n\r]+/);
	sloccount = prog.length;
	for (i = 0; i < sloccount; i++) {
		label[i] = getlab(prog[i]);
		if (/get|print|store|load|add|sub|square|mod|mul|div|goto|ifpos|ifzero|ifneg|stop/.test(label[i]))
			alert("should '" + label[i] + "' have a space in front of it??");
		opcode[i] = getop(prog[i]);
		if (label[i] == "" && opcode[i] != "" 
		    && !(/get|print|store|load|square|add|sub|mod|mul|div|goto|ifpos|ifzero|ifneg|stop/.test(opcode[i])))
			alert("'" + opcode[i] + "' doesn't seem to be a valid instruction");
		adr[i] = getadr(prog[i]);
		setmem(i, 0);
		if (opcode[i] == "init")
			setmem(i, adr[i]);
		if (/^-?[0-9]+/.test(opcode[i]))  // opcode is a literal number
			setmem(i, adr[i]);
	}
	document.f.output.value = "";  // clear output
	document.f.pcarea.value = "";
	document.f.accum.value = "";
	accumulator = 0;
	varindex = 0;
	pc = 0;
}
function run() {
	var instcount = 0;

	document.f.output.value = "";  // clear output
	pc = 0;
	while (pc >= 0) {
		instr();
		if (++instcount > INSTRUCTION_LIMIT) {
			alert("maximum instruction count " + INSTRUCTION_LIMIT +  " is reached; infinite loop?");
			break;
		}
	}
}
function step() {
	if (pc == null)
		restart();
	else if (pc >= 0)
		instr();
	else
		out("no next step");
}
function restart() {
	assemble();
	display();
}
function setmem(s, v) { // display stored values while setting a value
	var i = undefined;
	var pos = s
	if (! /^[0-9]+$/.test(s)) {
		pos = findlab(s);
		i = vartab[s];
		if (i == undefined && varindex < HOW_MANY_VARIABLE_SHOWED)
			i = vartab[s] = varindex++;
		if (i != undefined) {
			document.f["adr" + i].value = s;
			document.f["val" + i].value = v;
		}
	}
	mem[pos] = v;
}
function instr() {
	if (pc < 0)
		return;
	if (/^#/.test(label[pc]) || /^#/.test(opcode[pc]))
		return;

	if (opcode[pc] == "stop") {
		out("OK");
		out("-------------------------------------------");
		out("line count (without initializations):\t" + sloccount);
		out("instructions executed so far:\t\t" + (pc+1));
		out("-------------------------------------------");
		pc = -2;
	} else if (opcode[pc] == "get") {
		accumulator = prompt("Enter value for get", "");
		if (accumulator == null || accumulator == "")
			pc = -2;
	} else if (opcode[pc] == "print")
		out(accumulator);
	else if (opcode[pc] == "store")
		setmem(adr[pc], parseFloat(accumulator));
	else if (opcode[pc] == "load")
		accumulator = parseFloat(litoradr(adr[pc]));
	else if (opcode[pc] == "add")
		accumulator = parseFloat(accumulator) + parseFloat(litoradr(adr[pc]));
	else if (opcode[pc] == "sub")
		accumulator = parseFloat(accumulator) - parseFloat(litoradr(adr[pc]));
	else if (opcode[pc] == "mod")
		accumulator = parseFloat(accumulator) % parseFloat(litoradr(adr[pc]));
	else if (opcode[pc] == "mul")
		accumulator = parseFloat(accumulator) * parseFloat(litoradr(adr[pc]));
      else if (opcode[pc] == "square")
		accumulator = parseFloat(accumulator) * parseFloat(accumulator);
	else if (opcode[pc] == "div") {
		denom = parseFloat(litoradr(adr[pc]));
		if (denom == 0) {
			out("divide by zero at " + (pc+1) + "; program halted ");
			pc = -2;
		}
		accumulator = parseFloat(accumulator) / denom;
	} else if (opcode[pc] == "goto")
		pc = findlab(adr[pc])-1;
	else if (opcode[pc] == "ifpos")
		{if (accumulator >= 0) pc = findlab(adr[pc])-1;}
	else if (opcode[pc] == "ifzero")
		{if (parseFloat(accumulator) == 0) pc = findlab(adr[pc])-1;}
	else if (opcode[pc] == "ifneg")
		{if (accumulator < 0) pc = findlab(adr[pc])-1;}
	else if (opcode[pc] == "init") {
		out("tried to execute data at " + (pc+1));
		pc = -2;
	} else if (opcode[pc] != "") {
		out("invalid opcode '" + opcode[pc] + "' at " + (pc+1));
		pc = -2;
	}
	pc++;
	display();
}
function litoradr(s) { // decide if s is a literal or an address
	if (/^-?[0-9]+/.test(s))
		return s;
	return mem[findlab(s)];
}
function findlab(s) {
	var i;
	for (i = 0; i < prog.length; i++)
		if (label[i] == s)
			return i;
	alert("there is no statement labeled " + s);
	return -1;
}
function getlab(s) {
	lab = s.replace(/ +.*/, ""); // zap all but front
	return lab.toTurkishLowerCase();
}
function getop(s) {
	var op;
	op = s.replace(new RegExp('^[_' + TURKISH_LETTERS + ']\\S*'), ""); // zap label if present
	op = op.replace(/^[ ]+/, ""); // zap leading blanks if present
	op = op.replace(/ +.*/, ""); // zap after op
	return op.toLowerCase(); // no Turkish lowercase since this should be ascii
}
function getadr(s) {
	var adr;
	adr = s.replace(new RegExp('^[_' + TURKISH_LETTERS + ']\\S*'), ""); // zap label if present
	adr = adr.replace(new RegExp('^\\s*[_' + TURKISH_LETTERS + ']\\S*'), ""); // zap label if present
	adr = adr.replace(/^ +/, ""); // zap leading blanks if present
	adr = adr.replace(/ +.*/, ""); // zap after adr
	return adr.toTurkishLowerCase();
}
function display() {
	document.f.pcarea.value = pc >= 0 ? ((pc+1) + ":" + label[pc] + " " + opcode[pc] + " " + adr[pc]) : "";
	document.f.accum.value = accumulator;
}
function out(s) {
	document.f.output.value += s + "\n";
}
