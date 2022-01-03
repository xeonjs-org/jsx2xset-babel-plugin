// import XEON from '../xeon/xeon.demo.js';
import XEON from "./helper.js";
XEON.create_css_from_utf_8("* {\r\n      margin: 0;\r\n      padding: 0;\r\n}\r\n\r\n.container {\r\n      width: 100%;\r\n      height: 100%;\r\n}");

var App = function App(props) {
  return {
    "name": "div",
    "props": {
      "attributes": {},
      "children": ["\n                  hello div\n            "]
    }
  };
};

console.log({
  "name": App,
  "props": {
    "attributes": {},
    "children": []
  }
});
XEON.config({
  "name": "div",
  "props": {
    "attributes": {
      "className": "Hello"
    },
    "children": ["\n            ", {
      "name": "h1",
      "props": {
        "attributes": {},
        "children": ["Hello World"]
      }
    }, "\n            ", {
      "name": "hr",
      "props": {
        "attributes": {},
        "children": []
      }
    }, "\n            ", {
      "name": "p",
      "props": {
        "attributes": {},
        "children": ["This is a paragraph."]
      }
    }, "\n            ", {
      "name": App,
      "props": {
        "attributes": {},
        "children": []
      }
    }, "\n      "]
  }
}, document.getElementById("root"));