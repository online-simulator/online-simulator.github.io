// online-simulator.github.io

"use strict";

// ECMAScript6
const My_entry = {
  // major update . minor update . minor change . fatal bug-fix . minor bug-fix
  VERSION: "online-simulator.github.io.6.511.704.26.185",
  // major update. minor update/change. fatal/minor bug-fix
  Ver: {
    // inner
    plot: "2.72.17",
    // outer
    calc: "2.886.168",
    fluid: "1.61.2",
    cell: "0.13.3",
    wave: "1.85.16",
    pen: "1.91.13",
    else: "0.79.9"
  },
  flag: {
    useES6: (Number("0b0") === 0 && Number("0o0") === 0),  // calc-Ver.2.147.37
    hasFlagS: (("(\n)".match(/\(.*\)/s))? true: false),  // wave-Ver.1.43.11  // else-Ver.0.25.4
    hasBigInt: (typeof BigInt === "function")  // else-Ver.0.28.4
  }
};
