// online-simulator.github.io

"use strict";

// ECMAScript6
const My_entry = {
  // major update . minor update . minor change . fatal bug-fix . minor bug-fix
  VERSION: "online-simulator.github.io.6.321.138.16.74",
  // major update. minor update/change. fatal/minor bug-fix
  Ver: {
    // inner
    plot: "2.54.8",
    // outer
    calc: "2.271.62",
    fluid: "1.37.0",
    wave: "1.50.11",
    pen: "1.56.10",
    else: "0.45.7"
  },
  flag: {
    useES6: (Number("0b0") === 0 && Number("0o0") === 0),  // calc-Ver.2.147.37
    hasFlagS: (("(\n)".match(/\(.*\)/s))? true: false),  // wave-Ver.1.43.11  // else-Ver.0.25.4
    hasBigInt: (typeof BigInt === "function")  // else-Ver.0.28.4
  }
};
