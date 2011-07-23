var test = "\u00c0\u000c\u0080\u0030\u0080\u0040\u0081\u00e0\u000b\u0010\u0004\u0001\u0000\u0003\u0008\u0040\u0000\u0000\u000c\u0005\u0011\u0001\u0028\u0004\u000a\u0028\u0004\u000c\u001b\u0005\u0011\u0002\u0024\u0029\u0005\u0004\u0024\u0020\u0027\u000d\u0020\u0024\u0010\u0009\u0048\u0000\u0024\u000c\u0005\u0011\u0001\u0024\u0004\u000a\u0024\u0004\u000c\u001b\u0000\u0010\u0001\u00f0\u0001\u0028\u0000\u0002\u0028\u0002\u0000\u0080\u0003\u0030\u0002\u0000\u00c0\u0034\u0000\u0024\u0053\u0079\u0073\u0032\u0004\u0068\u0069\u0000\u0052\u0065\u0063\u0000\u0000\u0003\u0042\u0044\u00b3\u0054\u0069\u006e\u0069\u0074\u0000\u0001\u0001\u00ac\u0084\u0090\u0033\u0070\u0072\u0069\u006e\u0074\u0000\u0000\u002f\u0075\u0073\u0072\u002f\u006d\u0061\u0078\u002f\u0074\u0065\u0073\u0074\u002f\u0072\u0065\u0063\u002e\u0062\u0000";

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
	function read(s){
		var i = 0;

		function byte(){
			return s.charCodeAt(i++);
		}

		function chunk(l){
			i += l;
			return s.substr(i - l, l);
		}

		function comp(i, n){
			return i < 1 << n-1? i : i - (1 << n);
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

		function instruction(){
			var opcode = byte(), addrmode = byte(), amm, amsd, r, x;

			r = [opcode];
			amm = addrmode >> 6;
			amsd = [addrmode >> 3 & 7, addrmode & 7];
			r.push(
				amm == 0? [] :
				amm == 1? [op()] :
				[op(), op(), amm & 1]);
			for(x = 0; x < 2; x++)
				r.push(
					amsd[x] == 3 || amsd[x] > 5? [] :
					amsd[x] == 2? op() :
					amsd[x] >> 1? [op(), op(), amsd[x] & 1] :
					[op(), amsd[x] & 1]);
			return r;
		}

		function type(){
			var num = op(), size = op(), ptrs = op();

			return { desc_number: num, size: size, number_ptrs: ptrs,
				map: Array.prototype.map.call(chunk(ptrs), function(c){ return c.charCodeAt(0); }) };
		}

		function datum(){
			var code = byte(), count, offset, s, t;

			count = code & 15? code & 15 : op();
			offset = op();
			if(code >> 4 == 7)
				return { type: 7, data: count };
			switch(code >> 4){
				case 1:
					return { type: "bytes", data: replicate(count, byte) };
				case 2:
					return { type: "words", data: replicate(count, bigend32) };
				case 3:
					// should I encode this into JS' UTF-16?
					return { type: "string", data: chunk(count) };
				case 4:
					return { type: "ieee754", data: replicate(count, ieee754) };
				case 5:
					return { type: "array", data: replicate(count, function(){
						return replicate(2, bigend32);
					}) };
				case 6:
					/* wtf */
					return { type: "index" };
				case 7:
					return { type: "pop", count: count };
				case 8:
					return { type: "long", data: replicate(count, function(){
						return replicate(4, byte);
					}) };
			}
		}

		function link(){
			return { pc: op(), type: op(), sig: bigend32(), name: utf8() };
		}

		function all(){
			var code, types, data = [], name, links, head = header(), x;

			code = replicate(head.code_size, instruction);
			types = replicate(head.type_size, type);
			while(byte()){
				i--;
				data.push(datum());
			}
			name = utf8();
			links = replicate(head.link_size, link);
			// TODO: imports?
			return { name: name, header: head, code: code, types: types, data: data, links: links };
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

	print(showstuff(read(test)));
}();
