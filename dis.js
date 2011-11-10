"use strict";

var vm = dis();
vm.start(vm.compile(snarf("AltTest.dis")));
while(vm.run() > 0);

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

function runWith(map, code){
	var names = [], values = [];
	for(var k in map){
		names.push(k);
		values.push(map[k]);
	}
	names.push(code);
	return Function.apply(null, names).apply(null, values);
}

function dis(){
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

		// (binary64)
		function ieee754(){
			var sign, exp, mant, b;

			b = byte();
			sign = b >> 7;
			exp = b & 127;
			b = byte();
			exp <<= 4;
			exp |= b >> 4;
			mant = b & 15;
			for(b = 0; b < 6; b++){
				mant *= 1 << 8;
				mant += byte();
			}
			return (sign? -1 : 1)*Math.pow(2, exp - 1023)*(1 + mant*Math.pow(2, -52));
		}

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

	function makemp(data){
		var mp = [], ins, x, y, m;

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
					for(y = 0; y < ins.data.length; y++)
						mp[ins.offset + y*8] = ins.data[y];
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

	var procs = [];

	function start(module){
		procs.push(function(){
			return module([{ name: "init", sig: 0x4244b354 }])[0]([0,[]]);
		});
	}

	function sched(fun){
		if(fun)
			procs.push(fun);
	}

	// keep calling this until it returns 0
	function run(){
		var r, n;

		if(procs.length > 0)
			if(r = procs[n = Math.random()*procs.length | 0]())
				procs[n] = r;
			else
				rem(procs, n);
		return procs.length;
	}

	function rem(arr, n){
		if(n == arr.length - 1)
			arr.pop();
		else
			arr[n] = arr.pop();
	}

	function spawner(fun){
		return procs.push(fun) - 1;
	}

	var channelc = 0;
	function channel(){
		var cid = channelc++;
		var Midle = 0, Mrecv = 1, Msend = 2;
		var waiting = [], mode = Midle;

		function rem(n){
			if(waiting[n[0]] == n){
				if(waiting.length == n[0] + 1)
					waiting.pop();
				else
					(waiting[n[0]] = waiting.pop())[0] = n[0];
			}
			if(waiting.length == 0)
				mode = Midle;
		}

		function pick(){
			var n, i;

			n = waiting[i = Math.random()*waiting.length | 0];
			print(n[0] + " == " + i + "?");
			rem(n);
			return n;
		}

		function recv(ptr, cont){
			var n, c;
			print("recv: |waiting| = " + waiting.length);

			if(mode == Msend){
				n = pick();
				ptr[1][ptr[0]] = n[1];
				if(cont)
					sched(cont());
				if(n[2])
					sched(n[2]());
			}else{
				mode = Mrecv;
				waiting.push(n = [waiting.length, ptr, cont]);
				return function(){
					return rem(n);
				};
			}
		}

		function send(val, cont){
			var n, ptr, c;
			print("recv: |waiting| = " + waiting.length);

			if(mode == Mrecv){
				n = pick();
				ptr = n[1];
				ptr[1][ptr[0]] = val;
				if(cont)
					sched(cont());
				if(n[2])
					sched(n[2]());
			}else{
				mode = Msend;
				waiting.push(n = [waiting.length, val, cont]);
				return function(){
					return rem(n);
				};
			}
		}

		function recvpoll(){
			return mode == Msend? waiting.length : 0;
		}

		function sendpoll(){
			return mode == Mrecv? waiting.length : 0;
		}

		return [send, recv, sendpoll, recvpoll];
	}

	function alt(ptr, dst, cont){
		var ns = ptr[1][ptr[0]], nr = ptr[1][ptr[0] + 4], grp = [], inds = [], isdone = false, x, t, c;

		print("alt; ns = " + ns + "; nr = " + nr);

		function done(n){
			return function(){
				if(!isdone){
					isdone = true;
					for(var x = 0; x < grp.length; x++)
						if(grp[x])
							grp[x]();
					dst[1][dst[0]] = n;
					if(cont)
						procs.push(cont);
				}
			};
		}

		for(x = 0; x < ns + nr; x++)
			inds.push(x);

		// hopefully these are actually channels and pointers
		while(!isdone && inds.length > 0){ //x < ns + nr; x++){
			print("alt.for");
			x = inds[t = Math.random()*inds.length | 0];
			c = inds.pop();
			if(t < inds.length)
				inds[t] = c;
			t = ptr[1][ptr[0] + 8 + x*8 + 4]; // val pointer
			c = ptr[1][ptr[0] + 8 + x*8];
			if(x < ns)
				grp.push(c[0](t[1][t[0]], done(x)));
			else
				grp.push(c[1](t, done(x)));
		}
		print("end alt");
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
							return main([false, [0, []], pc], ret);
						};
					}(exporting[y].pc);
					break;
				}
				throw "module has no export (" + importing[x].name + ", " + importing[x].sig.toString(16) + ")";
			}
		return r;
	}

	function getargs(fp){
		var x = 32;
		
		function get(sz){
			return function(){
				for(; x % sz; x++);
				x += sz;
				return fp[1][fp[0] + x - sz];
			};
		}

		return {
			word: get(4),
			byte: get(1),
			dword: get(8),
		};
	}

	function pointer(base, offs){
		return {
			base: base, offs: offs,

			toString: function(){
				return base + "[1][" + base + "[0] + " + offs + "]";
			},

			addrof: function(){
				return "[" + offs + " + " + base + "[0], " + base + "[1]]"
			}
		};
	}

	// module interface:
	//  module = ([importing]) -> [exporting]
	//  importing = { name: string, sig: int }
	//  exporting = (frame /* fp for the call */, return /* returned after fibre's last ret */) -> exporting
	//  return = () -> exporting
	// the exporting function returns a continuation
	// inter-module calls use exporting functions

	function translate(source){
		var instsperfibre = 1;

		function operand(ins, i, addrof){
			var n = ins[i + 1], j;
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
					j = pointer(n[1]? "fp" : "mp", n[0]);
					return addrof? j.addrof() : j.toString();
					i = n[1]? "fp" : "mp";
					return addrof? "[" + n[0] + " + " + i + "[0], " + i + "[1]]" : i + "[1][" + i + "[0] + " + n[0] + "]";
				case 3:
					j = pointer(n[2]? "fp" : "mp", n[0]);
					j = pointer(j, n[1]);
					return addrof? j.addrof() : j.toString();
					j = n[2]? "fp" : "mp";
					i = j + "[1][" + j + "[0] + " + n[0] + "]";
					return addrof? "[" + j + "[0] + " + n[1] + ", " + j + "[1]]" :
						i + "[1][" + n[1] + " + " + i + "[0]]";
//					return (n[2]? "fp" : "mp") + "[" + n[0] + "][" + n[1] + "]";
			}
		}

		var code = [], x, y, m, ins;
		
		code.push("return function(importing){");
		code.push("var mp = [0, newmp()], tmp, tmq, tmr;");
		code.push("function main(fps, ret){");
		code.push(" var fp = fps[1], pc = fps[2], ic, pcc;");
		code.push(" for(ic = 0; ic < " + instsperfibre + ";) switch(pc){");
		for(x = 0; x < source.code.length; x++){
			code.push("  case " + x + ":");
			code.push("  //print(\"pc = " + x + "\");");
			print("ins = " + showstuff(source.code[x]));
			switch((ins = source.code[x])[0]){
				case 0x00: // nop
					break;
				case 0x01: // alt
					code.push("   fps[2] = " + (x + 1) + ";");
					code.push("   alt(" + operand(ins, 1, true) + ", " + operand(ins, 2, true) + ", function(){");
					code.push("    return main(fps, ret);");
					code.push("   });");
					code.push("   return;");
					break;
				case 0x03: // goto
					code.push("   ic += " + x + " - pc;");
					code.push("   pc = " + operand(ins, 2, true) + ";");
					code.push("   pc = pc[1][pc[0] + " + operand(ins, 1) + "*4];");
					code.push("   print(\"mov -> \" + pc);");
					code.push("   break;");
					break;
				case 0x04: // call
					code.push("   ic += " + x + " - pc;");
					code.push("   fps[2] = " + (x + 1) + ";");
					code.push("   fps = [fps, fp = " + operand(ins, 1) + ", pc = " + operand(ins, 2) + "];");
					code.push("   break;");
					break;
				case 0x05: // frame
					code.push("   " + operand(ins, 2) + " = [0, []];");
					break;
				case 0x06: // spawn
					code.push("   void function(nfps){");
					code.push("    spawner(function(){");
					code.push("     return main(nfps);");
					code.push("    });");
					code.push("   }([false, " + operand(ins, 1) + ", " + operand(ins, 2) + "]);");
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
					code.push("   ic += " + x + " - pc;");
					code.push("   if(!(fps = fps[0]))");
					code.push("    return ret;");
					code.push("   fp = fps[1];");
					code.push("   pc = fps[2];");
					code.push("   break;");
					break;
				case 0x0d: // jmp
					code.push("   ic += " + x + " - pc;");
					code.push("   pc = " + operand(ins, 2) + ";");
					code.push("   break;");
					break;
				case 0x0f: // exit
					code.push("   return;");
					break;
				case 0x11: // newa
					code.push("   " + operand(ins, 2) + " = [0, " + operand(ins, 1) + ", []];");
					break;
				case 0x8e: // consl
				case 0x1a: // consb
				case 0x1b: // consw
				case 0x1c: // consp
				case 0x1d: // consf
				case 0x1e: // consm
				case 0x1f: // consmp
					// Should I add a length element?
					code.push("   " + operand(ins, 2) + " = [" + operand(ins, 1) + ", " + operand(ins, 2) + "];");
					break;
				case 0x20: // headb
				case 0x21: // headw
				case 0x22: // headp
				case 0x23: // headf
				case 0x24: // headm
				case 0x25: // headmp
				case 0x8d: // headl
					code.push("   " + operand(ins, 2) + " = " + operand(ins, 1) + "[0];");
					break;
				case 0x26: // tail
					code.push("   " + operand(ins, 2) + " = " + operand(ins, 1) + "[1];");
					break;
				case 0x56: // lenl
					code.push("   for(tmp = 0, tmq = " + operand(ins, 1) + "; tmq; tmp++, tmq = tmq[1]);");
					code.push("   " + operand(ins, 2) + " = tmp;");
					code.push("   tmq = undefined;");
					break;
				case 0x12: // newcb
				case 0x13: // newcw
				case 0x14: // newcf
				case 0x15: // newcp
				case 0x16: // newcm
				case 0x17: // newcmp
				case 0x8f: // newcl
					code.push("   " + operand(ins, 2) + " = channel();");
					break;
				case 0x18: // send
					code.push("   fps[2] = " + (x + 1) + ";");
					code.push("   " + operand(ins, 2) + "[0](" + operand(ins, 1) + ", function(){");
					code.push("    return main(fps, ret);");
					code.push("   });");
					code.push("   return;");
					break;
				case 0x19: // recv
					code.push("   fps[2] = " + (x + 1) + ";");
					code.push("   " + operand(ins, 1) + "[1](" + operand(ins, 2, true) + ", function(){");
					code.push("    return main(fps, ret);");
					code.push("   });");
					code.push("   return;");
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
					code.push("   tmp = " + operand(ins, 1) + ";");
					code.push("   " + operand(ins, 0) + " = [tmp[0] + " + operand(ins, 2) + ", tmp[2]];");
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
				case 0x3f: // mulb
				case 0x40: // mulw
				case 0x41: // mulf
					code.push("   " + operand(ins, 2) + " = " + operand(ins, 0) + " * " + operand(ins, 1) + ";");
					break;
				// TODO: case 0x7b: // mull
				case 0x3a: // addw
				case 0x53: // addc
				case 0x39: // addb
				case 0x3b: // addf
					code.push("   " + operand(ins, 2) + " = " + operand(ins, 0) + " + " + operand(ins, 1) + ";"); 
					break;
				case 0x77: // addl
					// TODO: check logic .. negatives?
					code.push("   tmp = (" + operand(ins, 1) + "[0] + " + operand(ins, 0) + "[0]) % 0x100000000;");
					code.push("   " + operand(ins, 2) + " = [tmp, (tmp < " + operand(ins, 1) + "[0]? 1 : 0) + " +
							operand(ins, 1) + "[1] + " + operand(ins, 0) + "[1]];");
					break;
				case 0x78: // subl
				case 0x3c: // subb
				case 0x3d: // subw
				case 0x3e: // subf
					// TODO: long
					code.push("   " + operand(ins, 2) + " = " + operand(ins, 0) + " - " + operand(ins, 1) + ";");
					break;
				case 0x51: // insc
					code.push("   " + operand(ins, 2) + " = insc(" + operand(ins, 2) + ", " + operand(ins, 0) + ", " + operand(ins, 1) + ");"); 
					break;
				case 0x5a: // bleb
				case 0x60: // blew
				case 0x66: // blef
				case 0x6c: // blec
				case 0x83: // blel
				case 0x62: // bgew
				case 0x85: // bgel
				case 0x68: // bgef
				case 0x6e: // bgec
				case 0x5c: // bgeb
				case 0x61: // bgtw
				case 0x84: // bgtl
				case 0x67: // bgtf
				case 0x6d: // bgtc
				case 0x5b: // bgtb
				case 0x81: // bnel
				case 0x64: // bnef
				case 0x6a: // bnec
				case 0x58: // bneb
				case 0x5e: // bnew
					// TODO: handle blel
					code.push("   if(" + operand(ins, 1) + " " + 
						([0x5a, 0x60, 0x66, 0x6c, 0x83].indexOf(ins[0]) >= 0? "<=" :
						[0x62, 0x85, 0x68, 0x6e, 0x5c].indexOf(ins[0]) >= 0? ">=" :
						[0x61, 0x84, 0x67, 0x6d, 0x5b].indexOf(ins[0]) >= 0? ">" :
						"!=") +
						" " + operand(ins, 0) + "){");
					code.push("    ic += " + x + " - pc;");
					code.push("    pc = " + operand(ins, 2) + ";");
					code.push("    break;");
					code.push("   }");
					break;
				case 0x55: // lena
					code.push("   " + operand(ins, 2) + " = " + operand(ins, 1) + "[1];");
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
					code.push("    ic += " + x + " - pc;");
					code.push("    pc = " + operand(ins, 2) + ";");
					code.push("    break;");
					code.push("   }");
					break;
				case 0x6f: // slicea
					code.push("   tmp = " + operand(ins, 2) + ";");
					code.push("   tmq = " + operand(ins, 1) + ";");
					code.push("   " + operand(ins, 2) + " = [tmp[0] + tmq, " + operand(ins, 0) + " - tmq, tmp[2]];");
					break;
								default:
					code.push("   // unknown instruction: " + ins[0].toString(16));
			}
		}
		code.push("  default:");
		code.push("   throw \"pc out of bounds\";");
		code.push(" }");
		code.push("fps[2] = pc;");
		code.push("return function(){ return main(fps, ret); };");
		code.push("}");
		code.push("return exporter(importing, exports, main);");
		code.push("}");
		//return code.join("\n");
		print(code.join("\n"));

		return runWith({
			exports: source.links,
			entry: source.entry_pc,
			imports: source.imports,
			exporter: exporter,
			loader: loader,
			spawner: spawner,
			channel: channel,
			insc: insc,
			alt: alt,
			newmp: function(data){ // trying not to keep a reference to `source`
				return function newmp(){
					return makemp(data);
				};
			}(source.data)
		}, code.join("\n"));
	}

	var builtin = {
		Sys: function(importing){
			var x, ret = [];

			for(x = 0; x < importing.length; x++)
				if(importing[x].name == "print" && importing[x].sig == comp(0xac849033, 32))
					ret[x] = function(fp, cont){
//						print("fp = " + fp.toSource());
						print("sys->print: " + printx(getargs(fp)));
						return cont;
					};
				else
					throw "requested invalid export (" + importing[x].name + ", " + importing[x].sig + ") from $Sys";
			return ret;
		}
	};

	function printx(args){
		var fmt = args.word(), p, c, done, isbig, out = [];

		for(p = 0; (c = fmt.indexOf("%", p)) >= 0; p = c){
			out.push(fmt.substr(p, c - p));
			isbig = false;
			for(done = false; !done && c < fmt.length;)
				switch(fmt[++c]){
					case "s":
						out.push(args.word());
						done = true;
						break;
					case "d":
						if(isbig)
							out.push(args.dword()); // TODO: ..
						else
							out.push(args.word() | 0);
						done = true;
						break;
					case "f":
						// TODO: truncation, etc
						out.push(Number(args.dword()));
						done = true;
						break;
					case "b":
						isbig = true;
						break;
					case "%":
						out.push("%");
						done = true;
						break;
				}
			c++;
		}
		out.push(fmt.substr(p));
		return out.join("");
	}

	function compile(src){
		return translate(read(src));
	}

	return {
		compile: compile,
		getargs: getargs,
		loader: loader,
		run: run,
		start: start
	};


	var t;
	print(showstuff(t = read(test)));
	/*print*/(showstuff(t = translate(t)));
	start(t);
	runall();
}
