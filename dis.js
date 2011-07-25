//var test = "\u00c0\u000c\u0080\u0030\u0080\u0040\u0081\u00e0\u000b\u0010\u0004\u0001\u0000\u0003\u0008\u0040\u0000\u0000\u000c\u0005\u0011\u0001\u0028\u0004\u000a\u0028\u0004\u000c\u001b\u0005\u0011\u0002\u0024\u0029\u0005\u0004\u0024\u0020\u0027\u000d\u0020\u0024\u0010\u0009\u0048\u0000\u0024\u000c\u0005\u0011\u0001\u0024\u0004\u000a\u0024\u0004\u000c\u001b\u0000\u0010\u0001\u00f0\u0001\u0028\u0000\u0002\u0028\u0002\u0000\u0080\u0003\u0030\u0002\u0000\u00c0\u0034\u0000\u0024\u0053\u0079\u0073\u0032\u0004\u0068\u0069\u0000\u0052\u0065\u0063\u0000\u0000\u0003\u0042\u0044\u00b3\u0054\u0069\u006e\u0069\u0074\u0000\u0001\u0001\u00ac\u0084\u0090\u0033\u0070\u0072\u0069\u006e\u0074\u0000\u0000\u002f\u0075\u0073\u0072\u002f\u006d\u0061\u0078\u002f\u0074\u0065\u0073\u0074\u002f\u0072\u0065\u0063\u002e\u0062\u0000";
//var test = "\u00c0\u000c\u0080\u0030\u0080\u0040\u0000\u0004\u000c\u0002\u0001\u0000\u0001\u0008\u0040\u0000\u0000\u0008\u002d\u0011\u002a\u0028\u003a\u0011\u0001\u0028\u000c\u001b\u0000\u000c\u0001\u00e0\u0001\u0030\u0002\u0000\u00c0\u0034\u0000\u0024\u0053\u0079\u0073\u0000\u0052\u0065\u0063\u0000\u0000\u0001\u0042\u0044\u00b3\u0054\u0069\u006e\u0069\u0074\u0000\u0001\u0000\u0000\u002f\u0072\u0065\u0063\u0032\u002e\u0062\u0000";


var test = "\u00c0\u000c\u0080\u0030\u0080\u0040\u0082\u00d0\u001c\u0030\u0004\u0001\u0000\u0003\u0008\u0040\u0000\u0000\u0020\u0029\u0001\u0018\u0028\u0051\u0051\u0001\u0080\u0069\u0028\u0051\u0051\u0005\u0080\u0073\u0028\u0051\u0051\u0005\u0080\u0074\u0028\u0011\u0051\u0001\u0002\u002c\u0072\u008a\u0034\u002c\u0000\u002d\u0015\u002a\u0034\u0000\u0072\u008a\u0034\u002c\u0001\u002d\u0015\u002b\u0034\u0000\u0005\u0011\u0002\u0034\u0029\u0005\u0004\u0034\u0020\u0029\u000d\u0028\u0034\u0024\u0072\u008a\u0038\u002c\u0000\u002d\u0029\u0038\u0000\u0038\u0072\u008a\u003c\u002c\u0001\u003a\u00ad\u0038\u003c\u0000\u0034\u0028\u0027\u000d\u0030\u0034\u0010\u0009\u0048\u0000\u0034\u0020\u003a\u0011\u0001\u0030\u0076\u0001\u0028\u0080\u0040\u0077\u0000\u0008\u0028\u0086\u00ca\u0010\u0080\u0040\u001b\u0005\u0011\u0003\u003c\u0029\u000d\u0020\u003c\u0020\u0029\u000d\u0024\u003c\u0024\u0004\u000a\u003c\u0000\u000c\u001b\u0000\u0030\u0002\u00c3\u0080\u0001\u0004\u0000\u0002\u0030\u0002\u0000\u00c0\u0003\u0080\u0048\u0002\u0000\u00f0\u0034\u0000\u0024\u0053\u0079\u0073\u0036\u0004\u0025\u0073\u0020\u0025\u0064\u000a\u0082\u0008\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0028\u0035\u0018\u0068\u0065\u006c\u006c\u006f\u0081\u0028\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0052\u0065\u0066\u0054\u0065\u0073\u0074\u0000\u0000\u0003\u0042\u0044\u00b3\u0054\u0069\u006e\u0069\u0074\u0000\u0001\u0001\u00ac\u0084\u0090\u0033\u0070\u0072\u0069\u006e\u0074\u0000\u0000\u002f\u0052\u0065\u0066\u0054\u0065\u0073\u0074\u002e\u0062\u0000";

function showstuff(s){
	var r = "", i;

	if(typeof s == "object"){
		if(s instanceof Array){
			for(i = 0; i < s.length; i++)
				r += showstuff(s[i]) + ", ";
			return "[" + r + "]";
		}
		for(i in s)
			r += i + ": " + showstuff(s[i]) + ", ";
		return "{" + r + "}";
	}
	return s;
}

function replicate(n, f){
	var r = [];

	while(n-- > 0)
		r.push(f());
	return r;
}

var dis = function(){
	var builtin;

	function comp(i, n){
		return n == 32? i | 0 :
			n < 32? i < 1 << n-1? i : i - (1 << n) :
			i < Math.pow(2, n-1)? i : i - Math.pow(2, n);
	}

	function read(s){
		var i = 0;

		function byte(){
			return s.charCodeAt(i++);
		}

		function chunk(l){
			i += l;
			return s.substr(i - l, l);
		}

		function bigend32(){
			return byte() << 24 | byte() << 16 | byte() << 8 | byte();
		}

		function utf8(){
			var x = i;

			for(; s.charAt(i) != "\u0000"; i++);
			return s.substr(x, i++ - x);
		}

		// TODO: ieee754

		function header(){
			var r = {};
	
			r.magic = op();
			if(r.magic == 923426)
				r.signature = chunk(op());
			r.runtime_flag = op();
			r.stack_extent = op();
			r.code_size = op();
			r.data_size = op();
			r.type_size = op();
			r.link_size = op();
			r.entry_pc = op();
			r.entry_type = op();
			return r;
		}

		// operand = [] | [immed] | [ind, isfp] | [ind1, ind2, isfp]
		// [code, mid_operand, left_operand, right_operand]
		function instruction(){
			print("ins at " + i);
			var opcode = byte(), addrmode = byte(), amm, amsd, r, x;

			r = [opcode];
			amm = addrmode >> 6;
			amsd = [addrmode >> 3 & 7, addrmode & 7];
			r.push(
				amm == 0? [] :
				amm == 1? [op()] :
				[op(), !(amm & 1)]);
			for(x = 0; x < 2; x++)
				r.push(
					amsd[x] == 3 || amsd[x] > 5? [] :
					amsd[x] == 2? [op()] :
					amsd[x] >> 1? [op(), op(), amsd[x] & 1] :
					[op(), !!(amsd[x] & 1)]);
			return r;
		}

		function type(){
			var num = op(), size = op(), ptrs = op();

			return { desc_number: num, size: size, number_ptrs: ptrs,
				map: Array.prototype.map.call(chunk(ptrs), function(c){ return c.charCodeAt(0); }) };
		}

		function datum(){
			print("data at " + i.toString(16));
			var code = byte(), count, offset, s, t;

			count = code & 15? code & 15 : op();
			offset = op();
			if(code >> 4 == 7)
				return { type: 7, data: count };
			switch(code >> 4){
				case 1:
					return { type: "bytes", offset: offset, data: replicate(count, byte) };
				case 2:
					return { type: "words", offset: offset, data: replicate(count, bigend32) };
				case 3:
					// should I encode this into JS' UTF-16?
					return { type: "string", offset: offset, data: chunk(count) };
				case 4:
					return { type: "ieee754", offset: offset, data: replicate(count, ieee754) };
				case 5:
					return { type: "array", offset: offset, data: replicate(count, function(){
						return replicate(2, bigend32);
					}) };
				case 6:
					/* wtf */
					return { type: "index" };
				case 7:
					return { type: "pop", offset: offset, count: count };
				case 8:
					return { type: "longs", offset: offset, data: replicate(count, function(){
						return replicate(8, byte);
					}) };
			}
		}

		function link(){
			return { pc: op(), type: op(), sig: bigend32(), name: utf8() };
		}

		function moduleimport(){
			function functionimport(){
				print("functionimport @ " + i.toString(16));
				return { sig: bigend32(), name: utf8() };
			}

			var t = replicate(op(), functionimport);
			print("moduleimport() = " + showstuff(t));
			return t;
		}

		function all(){
			var code, types, data = [], name, links, imports, head = header(), x;

			code = replicate(head.code_size, instruction);
			types = replicate(head.type_size, type);
			while(byte()){
				i--;
				data.push(datum());
			}
			name = utf8();
			links = replicate(head.link_size, link);
			imports = replicate(op(), moduleimport);
			print("read all: " + i.toString(16));
			return { name: name, header: head, code: code, types: types, data: data, links: links, imports: imports };
		}
	
		function op(){
			var b = byte();

			if((b & 128) == 0)
				return comp(b & 127, 7);
			if((b & (128 | 64)) == 128)
				return comp((b & 63) << 8 | byte(), 14);
			return comp((b & 63) << 24 | byte() << 16 | byte() << 8 | byte(), 30);
		}

		return all();
	}

	function quotes(s){
		// TODO: ..
		return s.toSource();
	}

	function makemp(data){
		var mp = [], ins, x, y;

		for(x = 0; x < data.length; x++)
			switch((ins = data[x]).type){
				case "bytes":
				case "words":
					m = ins.type == "words"? 4 : 1;
					for(y = 0; y < ins.data.length; y++)
						mp[ins.offset + y*m] = ins.data[y];
					break;
				case "string":
					mp[ins.offset] = ins.data;
					break;
				case "ieee754":
					// TODO: ..
					break;
				case "array":
					for(y = 0; y < ins.data.length; y++)
						mp[ins.offset + y*4] = [0, ins.data[1], []];
					break;
				case "set":
					// TODO: ?!#
					break;
				case "pop":
					// TODO: ?!#
					break;
				case "longs":
					// TODO: 0xff << 24 < 0
					for(y = 0; y < ins.data.length; y++)
						mp[ins.offset + y*8] = [
							ins.data[y][4] << 24 | ins.data[y][5] << 16 | ins.data[y][6] << 8 | ins.data[y][7],
							ins.data[y][0] << 24 | ins.data[y][1] << 16 | ins.data[y][2] << 8 | ins.data[y][3]];
			}
		print("mp = " + mp.toSource());
		return mp;
	}

	function insc(s, p, c){
		return s.substr(0, p) + String.fromCharCode(c) + s.substr(p + 1);
	}

	function run(module){
		var cur = module([{ name: "init", sig: 0x4244b354 }])[0]([]);
		do{
			cur = cur();
		}while(cur);
	}

	// loader :: (string, [importing]) -> [exporting]
	function loader(name, imports){
		if(name[0] == "$")
			return builtin[name.substr(1)](imports);
		// wonder what will go here
	}

	function exporter(importing, exporting, main){
		var r = [], x, y;

		for(x = 0; x < importing.length; x++)
			for(y = 0; y < exporting.length; y++){
				if(importing[x].name == exporting[y].name && importing[x].sig == exporting[y].sig){
					print("exporter matched " + importing[x].name);
					r[x] = function(pc){
						return function(fp, ret){
							return main([false, [], pc], ret);
						};
					}(exporting[y].pc);
					break;
				}
				throw "module has no export (" + importing[x].name + ", " + importing[x].sig.toString(16) + ")";
			}
		return r;
	}

	// module interface:
	//  module = ([importing]) -> [exporting]
	//  importing = { name: string, sig: int }
	//  exporting = (frame /* fp for the call */, return /* returned after fibre's last ret */) -> exporting
	//  return = () -> exporting
	// the exporting function returns a continuation
	// inter-module calls use exporting functions

	function compile(source){
		function operand(ins, i, addrof){
			var n = ins[i + 1];
			switch(n.length){
				case 0:
					if(i == 0)
						return operand(ins, 2);
					throw "expected operand";
				case 1:
					if(addrof)
						throw "address of immediate";
					return "" + n[0];
				case 2:
					i = n[1]? "fp" : "mp";
					return addrof? "[" + n[0] + ", " + i + "]" : i + "[" + n[0] + "]";
				case 3:
					i = (n[2]? "fp" : "mp") + "[" + n[0] + "]";
					return addrof? "[" + i + "[0]+" + n[0] + ", " + i + "[1]]" :
						i + "[1][" + n[1] + "+" + i + "[0]]";
//					return (n[2]? "fp" : "mp") + "[" + n[0] + "][" + n[1] + "]";
			}
		}

		var code = [], x, y, m, ins;
		
		code.push("return function(importing){");
		code.push("var mp = newmp(), tmp;");
		code.push("function main(fps, ret){");
		code.push(" var fp = fps[1], pc = fps[2];");
		code.push(" for(;;) switch(pc){");
		for(x = 0; x < source.code.length; x++){
			code.push("  case " + x + ": /*print(\"pc = \" + " + x + ");*/");
			print("ins = " + showstuff(source.code[x]));
			switch((ins = source.code[x])[0]){
				case 0x00: // nop
					break;
				case 0x04: // call
					code.push("   fps[2] = " + (x + 1) + ";");
					code.push("   fps = [fps, fp = " + operand(ins, 1) + ", pc = " + operand(ins, 2) + "];");
					code.push("   break;");
					break;
				case 0x05: // frame
					code.push("   " + operand(ins, 2) + " = [0, []];");
					break;
				case 0x08: // load
					code.push("   " + operand(ins, 2) + " = loader(" + operand(ins, 1) + ", imports[" + operand(ins, 0) + "]);");
					break;
				case 0x09: // mcall
					code.push("   fps[2] = " + (x + 1) + ";");
					code.push("   return function(n, f){");
					code.push("     return function(){");
					code.push("       return n(f, function(){");
					code.push("         return main(fps, ret);");
					code.push("       });");
					code.push("     };");
					code.push("   }(" + operand(ins, 2) + "[" + operand(ins, 0) + "], " + operand(ins, 1) + ");");
					break;
				case 0x0c: // ret
					code.push("   if(!(fps = fps[0]))");
					code.push("    return ret;");
					code.push("   fp = fps[1];");
					code.push("   pc = fps[2];");
					code.push("   break;");
					break;
				case 0x0d: // jmp
					code.push("   pc = " + operand(ins, 2) + ";");
					code.push("   break;");
					break;
				case 0x11: // newa
					code.push("   " + operand(ins, 2) + " = [0, " + operand(ins, 1) + ", []];");
					break;
				case 0x27: // lea
					code.push("   " + operand(ins, 2) + " = " + operand(ins, 1, true) + ";");
					break;
				// the following seems weird .. documentation suggests
				// indw, etc grab the value from the array; behaviour
				// suggests it grabs the address, like indx
				case 0x28: // indx
				case 0x52: // indc
				case 0x72: // indw
				case 0x73: // indf
				case 0x74: // indb
				case 0x91: // indl
				// TODO: multiply index by element size .. maybe
					code.push("   " + operand(ins, 0) + " = [" + operand(ins, 2) + ", " + operand(ins, 1) + "[2]];");
					break;
				case 0x29: // movp
				case 0x2a: // movm
				case 0x2b: // movmp
				case 0x2c: // movb
				case 0x2d: // movw
				case 0x2e: // movf
				case 0x76: // movl
					code.push("   " + operand(ins, 2) + " = " + operand(ins, 1) + ";");
					break;
				case 0x3a: // addw
				case 0x53: // addc
				case 0x39: // addb
				case 0x3b: // addf
					code.push("   " + operand(ins, 2) + " = " + operand(ins, 1) + " + " + operand(ins, 0) + ";"); 
					break;
				case 0x77: // addl
					// TODO: check logic .. negatives?
					code.push("   tmp = (" + operand(ins, 1) + "[0] + " + operand(ins, 0) + "[0]) % 0x100000000;");
					code.push("   " + operand(ins, 2) + " = [tmp, (tmp < " + operand(ins, 1) + "[0]? 1 : 0) + " +
							operand(ins, 1) + "[1] + " + operand(ins, 0) + "[1]];");
					break;
				case 0x51: // insc
					code.push("   " + operand(ins, 2) + " = insc(" + operand(ins, 2) + ", " + operand(ins, 0) + ", " + operand(ins, 1) + ");"); 
					break;
				case 0x5a: // bleb
				case 0x60: // blew
				case 0x66: // blef
				case 0x6c: // blec
				case 0x83: // blel
					// TODO: handle blel
					code.push("   if(" + operand(ins, 1) + " <= " + operand(ins, 0) + "){");
					code.push("    pc = " + operand(ins, 2) + ";");
					code.push("    break;");
					code.push("   }");
					break;
				case 0x63: // beqf
				case 0x86: // beql
				case 0x69: // beqc
				case 0x57: // beqb
				case 0x5d: // beqw
					if(ins[0] == 0x86) // blel
						code.push("   if(" + operand(ins, 1) + "[0] == " + operand(ins, 0) + "[0] && " +
								operand(ins, 1) + "[1] == " + operand(ins, 0) + "[1]){");
					else
						code.push("   if(" + operand(ins, 1) + " == " + operand(ins, 0) + "){");
					code.push("    pc = " + operand(ins, 2) + ";");
					code.push("    break;");
					code.push("   }");
					break;
				default:
					code.push("   // unknown instruction: " + ins[0]);
			}
		}
		code.push("  default:");
		code.push("   throw \"pc out of bounds\";");
		code.push(" }");
		code.push("}");
		code.push("return exporter(importing, exports, main);");
		code.push("}");
		//return code.join("\n");
		print(code.join("\n"));
		return Function("exports", "entry", "imports", "exporter", "loader", "insc", "newmp", code.join("\n"))(
			source.links,
			source.entry_pc,
			source.imports,
			exporter,
			loader,
			insc,
			function(data){ // trying not to keep a reference to `source`
				return function newmp(){
					return makemp(data);
				};
			}(source.data));
	}

	builtin = {
		Sys: function(importing){
			var x, ret = [];

			for(x = 0; x < importing.length; x++)
				if(importing[x].name == "print" && importing[x].sig == comp(0xac849033, 32))
					ret[x] = function(fp, cont){
						print("sys->print called somehow! fp = " + fp);
						return cont;
					};
				else
					throw "requested invalid export (" + importing[x].name + ", " + importing[x].sig + ") from $Sys";
			return ret;
		}
	};

	var t;
	print(showstuff(t = read(test)));
	/*print*/(showstuff(t = compile(t)));
	run(t);
}();
