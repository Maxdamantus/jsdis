implement RandTest;

include "sys.m";
include "draw.m";

sys: Sys;

RandTest: module {
        init: fn(c: ref Draw->Context, a: list of string);
};

init(c: ref Draw->Context, a: list of string){
	sys = load Sys Sys->PATH;
	test := array[10] of int;
	for(i := 0; i < len test; i++)
		test[i] = i;
	randomise(test);
	printarr(test);
}

randomise(arr: array of int){
	c := chan of int;
	for(i := 0; i < len arr; i++)
		spawn put(arr, i, c);
	for(i = 0; i < len arr; i++)
		c<- = arr[i];
}

put(arr: array of int, i: int, c: chan of int){
	arr[i] = <-c;
}

printarr(arr: array of int){
	for(x := 0; x < len arr; x++)
		sys->print("[%d] = %d\n", x, arr[x]);
}
