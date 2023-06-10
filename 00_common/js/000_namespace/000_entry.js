// online-simulator.github.io

"use strict";

// ECMAScript6
const My_entry = {
  // major update . minor update . minor change . fatal bug-fix . minor bug-fix
  VERSION: "online-simulator.github.io.6.223.97.12.51",
  // major update. minor update/change. fatal/minor bug-fix
  Ver: {
    // inner
    plot: "1.53.8",
    // outer
    calc: "2.159.38",
    fluid: "1.33.0",
    wave: "1.48.11",
    pen: "1.54.10",
    else: "0.26.4"
  },
  flag: {
    useES6: (Number("0b0") === 0 && Number("0o0") === 0),  // calc-Ver.2.147.37
    hasFlagS: (("(\n)".match(/\(.*\)/s))? true: false)  // wave-Ver.1.43.11  // else-Ver.0.25.4
  }
};
