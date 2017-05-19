function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
gs.log("checking:"+a_start+"-"+a_end+" <-> " + b_start+"-"+b_end);
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
    if (b_start <  a_start && a_end   <  b_end) return true; // a in b
    return false;
}

function multipleDateRangeOverlaps() {
var count = 0;
    var i, j;
    if (arguments.length % 2 !== 0)
        throw new TypeError('Arguments length must be a multiple of 2');
    for (i = 0; i < arguments.length - 2; i += 2) {
        for (j = i + 2; j < arguments.length; j += 2) {
            if (
                dateRangeOverlaps(
                    arguments[i], arguments[i+1],
                    arguments[j], arguments[j+1]
                )
            ) count++;
        }
    }
    return count;
}

gs.log(multipleDateRangeOverlaps(0,5,2,7,6,6,1,2,4,5));

