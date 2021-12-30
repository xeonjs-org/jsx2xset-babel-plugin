console.clear();
console.log(">>========================================================================================================================================>>");

const babel = require('@babel/core');
const fs = require('fs');

const config = {
      "presets": [
            [
                  "@babel/preset-env",
                  {
                        "modules": false
                  }
            ]
      ],
      "plugins": [
            [
                  "./XSET/index.js"
            ]
      ]
};

let code = fs.readFileSync("./test/main.jsx", "utf8");
// Remove all whitespaces, tabs, newlines, etc.
code = code.trim().replace(/(\r\n|\n|\r|\t)/gm, "").replace(/\s+/gm, " ").trim();

babel.transform(code, config, function (err, result) {


      if (err) {
            console.log(err);
            fs.writeFileSync("./test/result.js", "Error\n\n\n" + err, "utf8");
            return;
      }

      var { code, map, ast } = result;

      fs.writeFileSync("./test/result.js", code, "utf8");

      console.log(code);
});
