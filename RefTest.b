implement RefTest;

include "sys.m";
include "draw.m";

sys: Sys;

RefTest: module {
        init: fn(c: ref Draw->Context, a: list of string);
};

init(c: ref Draw->Context, a: list of string){
        sys = load Sys Sys->PATH;
        x := "hello";
	x[1] = 'i';
	x[5] = 's';
	x[5] = 't';
	y := array[2] of int;
	y[0] = 42;
	y[1] = 43;
	z := sys->print("%s %d\n", x, add(y[0], y[1]));
	z++;
	init(c, a);
}

add(a, b: int): int {
	return a + b;
}
