implement AltTest;

include "sys.m";
include "draw.m";

AltTest: module {
	init: fn(c: ref Draw->Context, a: list of string);
};

sys: Sys;

init(x: ref Draw->Context, y: list of string){
	sys = load Sys Sys->PATH;

#	spawn rng(d := chan of int);
#	for(;;)
#		sys->print("%d\n", <-d);
#		sys->print("%d\n", <-d);
#		sys->print("%d\n", <-d);

#	spawn loop(10000000, a := chan of int);
#	spawn loop(1000000, b := chan of int);
#	spawn loop(100000, c := chan of int);

#	spawn w(a := chan of int);
#	spawn w(b := chan of int);
#	spawn w(c := chan of int);

	a := chan of int;
	b := chan of int;
	c := chan of int;
	d := chan of int;
	e := chan of int;

	spawn w(a, nil);
	spawn w(b, nil);
	spawn w(c, nil);
	#<-e; <-e;

	sys->print("about to alt\n");

	for(;;)
		alt{
			<-c =>
				sys->print("got c\n");
			<-a =>
				sys->print("got a\n");
			<-b =>
				sys->print("got b\n");
		}
}

w(g: chan of int, e: chan of int){
	if(e != nil)
		spawn w(e, nil);
	g<- = 42;
	spawn w(g, nil);
}

#se(s: string): int{
#	sys->print("%s\n", s);
#	return 0;
#}

loop(n: int, c: chan of int){
	while(n > 0)
		c<- = n--;
}

#rng(c: chan of int){
#	c<- = 42;
#	c<- = 43;
#	for(;;)
#		alt{
#			c<- = 0 => sys->print("what");
#			c<- = 1 => sys->print("what");
#			c<- = 2 => sys->print("what");
#			c<- = 3 => sys->print("what");
#			c<- = 4 => sys->print("what");
#			c<- = 5 => sys->print("what");
#			c<- = 6 => sys->print("what");
#			c<- = 7 => sys->print("what");
#			c<- = 8 => sys->print("what");
#			c<- = 9 => sys->print("what");
#		}
#}
