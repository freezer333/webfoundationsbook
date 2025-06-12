const assert = require('assert');


// One of the operands is a number, so 
// the other is converted to a number if 
// possible.  It is possible, so 5 == 5
assert(5 == "5");

// The rules of + are different than =
// While = tries to convert one operand
// to number if the other operand is a number, 
// the + operator does not.  It converts
// one operand to string if the other is a
// string.
assert((5 + "5") == "55");

// One of the operands is a number, 
// but converting to a number fails
// The 5 is turned into a string, 
// and clearly that's not the same as
// "hello"
assert(5 != "hello");

// One of the operands is a number, 
// and "0" can be converted to a number, 
// so we get 0 == 0 which is true
assert(0 == "0");

// This one is tricky.  One is a number, 
// so we try to convert the empty string
// into a number.  parseFloat("") results 
// NaN, however the conversion rules also
// state specifically that the empty string
// converts to 0 when coerced to a number. 
// Therefore, the conversion works, and 
// we are back to comparing 0 == 0!
assert(0 == "");


// This is false because they are both
// objects.  Objects are only equal if 
// they point to the same location in memory
assert({} != []);

// The empty string is turned into 
// a string - which results in an empty string 
assert("" == []);


// The - operator forces both sides
// to be a number.  The boolean true
// converts to 1, and 1-2 is negative 1`
assert( (true - 2) == -1);
