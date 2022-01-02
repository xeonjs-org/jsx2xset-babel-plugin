import XEON from '../xeon/xeon.demo.js';

const App = (props) => {

      return (
            <div>
                  hello div
            </div>
      );
};

console.log(<App />);

XEON.config(
      <div className="Hello">
            <h1>Hello World</h1>
            <hr />
            <p>This is a paragraph.</p>
            <App />
      </div>,
      document.getElementById("root")
);

