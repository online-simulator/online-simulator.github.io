// online-simulator.github.io

"use strict";

// ECMAScript6
const My_entry = {
  // major update . minor update . minor change . fatal bug-fix . minor bug-fix
  VERSION: "online-simulator.github.io.6.357.175.18.93",
  // major update. minor update/change. fatal/minor bug-fix
  Ver: {
    // inner
    plot: "2.55.9",
    // outer
    calc: "2.331.81",
    fluid: "1.39.0",
    cell: "0.4.2",
    wave: "1.53.11",
    pen: "1.57.10",
    else: "0.48.7"
  },
  flag: {
    useES6: (Number("0b0") === 0 && Number("0o0") === 0),  // calc-Ver.2.147.37
    hasFlagS: (("(\n)".match(/\(.*\)/s))? true: false),  // wave-Ver.1.43.11  // else-Ver.0.25.4
    hasBigInt: (typeof BigInt === "function")  // else-Ver.0.28.4
  }
};
