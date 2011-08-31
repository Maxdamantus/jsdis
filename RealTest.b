implement RealTest;

include "sys.m";
include "draw.m";

sys: Sys;

RealTest: module {
	init: fn(c: ref Draw->Context, a: list of string);
};

init(c: ref Draw->Context, a: list of string){
	sys = load Sys Sys->PATH;
	b := 0.33333333333333333333333333333333333333333333333333333333;
	d := 3.141592;
	d *= 2.0 + b;
	sys->print("%f %f\n", d, b);
}
