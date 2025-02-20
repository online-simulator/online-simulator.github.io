// online-simulator.github.io

"use strict";

// ECMAScript6
const My_entry = {
  // major update . minor update . minor change . fatal bug-fix . minor bug-fix
  VERSION: "online-simulator.github.io.6.455.589.22.127",
  // major update. minor update/change. fatal/minor bug-fix
  Ver: {
    // inner
    plot: "2.58.12",
    // outer
    calc: "2.741.110",
    fluid: "1.50.1",
    cell: "0.11.3",
    wave: "1.79.14",
    pen: "1.91.13",
    else: "0.72.8"
  },
  flag: {
    useES6: (Number("0b0") === 0 && Number("0o0") === 0),  // calc-Ver.2.147.37
    hasFlagS: (("(\n)".match(/\(.*\)/s))? true: false),  // wave-Ver.1.43.11  // else-Ver.0.25.4
    hasBigInt: (typeof BigInt === "function")  // else-Ver.0.28.4
  }
};
