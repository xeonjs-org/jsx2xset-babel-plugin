export default function main(context) {
  var a = a !== null && a !== void 0 ? a : b;
  return {
    "name": "div",
    "props": {
      "attributes": {
        "className": "container",
        "id": "first-div",
        "style": style.container
      },
      "children": [" ", {
        "name": "h1",
        "props": {
          "attributes": {
            "style": {
              color: "#fff",
              backgroundColor: "#000"
            }
          },
          "children": ["Hello World"]
        }
      }, " ", {
        "name": "h1",
        "props": {
          "attributes": {},
          "children": ["My name is Arif Sardar ", a]
        }
      }, " "]
    }
  };
}