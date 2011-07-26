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
	sys->print("--");
	printarr(test[0:5]);
	sys->print("--");
	printarr(test[1:]);
	sys->print("--");
	printarr(test[10:]);
	sys->print("--");
	sys->print("--");
	parasort(test, nil);
#	printarr(test);
}

randomise(arr: array of int){
	c := chan of int;
	d := chan of int;
	for(i := 0; i < len arr; i++)
		spawn get(arr, i, c, d);
	for(i = 0; i < len arr; i++)
		<-d;
	for(i = 0; i < len arr; i++)
		arr[i] = <-c;
}

get(arr: array of int, i: int, c: chan of int, d: chan of int){
	t := arr[i];
	d<- = 0;
	c<- = t;
}

printarr(arr: array of int){
	for(x := 0; x < len arr; x++)
		sys->print("[%d] = %d\n", x, arr[x]);
}

swap(arr: array of int, m: int, n: int){
	t := arr[m];
	arr[m] = arr[n];
	arr[n] = t;
}

parasort(arr: array of int, notify: chan of int){
	printarr(arr);
	sys->print("--");
	if(len arr == 2){
		if(arr[0] > arr[1])
			swap(arr, 0, 1);
	}else if(len arr > 2){
		pv := arr[store := 0];
		for(x := 0; x < len arr - 1; x++)
			if(arr[x] <= pv)
				swap(arr, x, store++);
		c := chan of int;
		spawn parasort(arr[0:pv], c);
		spawn parasort(arr[pv+1:], c);
		<-c; <-c;
	}
	if(notify != nil)
		notify<- = 0;
}
