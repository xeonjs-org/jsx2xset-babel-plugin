# JSX2XSET
### Convert JSX Syntaxes to XSET(Xeon-Stack-Element-Tree) Object.

```js
export default function App (props) {

      return (
            <div className="container" id="first-div" style={style.container}>
                  <h1 style={{ color: "#fff", backgroundColor: "#000" }}>Hello World</h1>
                  <h1>My name is Arif Sardar</h1>
            </div>
      );
}
```
### Convert this to :
```js
export default function App (props) {

      return ({
            "name": "div",
            "props": {
                  "attributes": {
                        "className": "container",
                        "id": "first-div",
                        "style": style.container
                  },
                  "children": [{
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
                  }, {
                        "name": "h1",
                        "props": {
                              "attributes": {},
                              "children": ["My name is Arif Sardar"]
                        }
                  }]
            }
      });
```