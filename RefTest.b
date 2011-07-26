implement RefTest;

include "sys.m";
include "draw.m";

sys: Sys;

RefTest: module {
        init: fn(c: ref Draw->Context, a: list of string);
};

w := big 0;
s := 0;

init(c: ref Draw->Context, a: list of string){
        sys = load Sys Sys->PATH;
        x := "hello";
	x[1] = 'i';
	x[5] = 's';
	x[5] = 't';
	y := array[2] of int;
	y[0] = 42;
	y[1] = 43;
	z := sys->print("%s %bd %d!\n", x, big 1234567, add(y[0], y[1]));
	z++;
#	if(w++ != big 5)
#		init(c, a);
#	spawn th1();
#	spawn th2();
	d := chan of int;
	spawn chantest(d);
#	spawn thread();
#	while(s != 1234);
	sys->print("end!!");
	sys->print("%d\n", <-d);
	test := array[10] of int;
	for(i := 0; i < len test; i++)
		test[i] = i;
	randomise(test);
	printarr(test);
}

add(a, b: int): int {
	return a + b;
}

thread(){
	s = 1234;
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

chantest(a: chan of int){
	a<- = 42;
}

th1(){
	for(;;)
		sys->print("thread1!");
}

th2(){
	for(;;)
		sys->print("thread2!");
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
	if(len arr < 3){
		if(arr[0] > arr[1])
			swap(arr, 0, 1);
	}else{
		pv := arr[store := 0];
		for(x := 0; x < len arr; x++)
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
