implement ListTest;

include "sys.m";
include "draw.m";

sys: Sys;

ListTest: module {
        init: fn(c: ref Draw->Context, a: list of string);
};

init(c: ref Draw->Context, a: list of string){
	sys = load Sys Sys->PATH;
	l := 42 :: 43 :: nil;
	m := l;
	m = tl m;
	o := (123, 456) :: (789, 101) :: nil;
	sys->print("%d %d %d\n", hd l, hd tl l, hd m);
}
