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
}

add(a, b: int): int {
	return a + b;
}

thread(){
	s = 1234;
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
