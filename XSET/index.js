/**
 * Copyright (c) 2021-present, ChatCord, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"user_strict";

const fs = require("fs");
const pathModule = require("path");


/**
 * 
 * @param {object} param0 
 * @returns - The code to convert with.
 */
module.exports = function ({ types: t }) {

      /**
       * @description - A function to check Uppercase words.
       * 
       * @param {String} Word - The word to check. 
       * @returns {Boolean} - Returns true if the word is uppercase.
       */
      function isUpperCase(Word) {
            return Word === Word.toUpperCase();
      }

      // const isExtension = (openingElement, path) => (path.scope.hasOwnBinding(openingElement.name.name) || path.scope.hasBinding(openingElement.name.name));

      /**
       * @description - A function to generate Fragment from the JSX.
       * 
       * @param {Object} path 
       * @param {Object} state 
       * @returns {Object}
       */
      function generateFragment(path, state) {
            const FILE = state.file,
                  OPTIONS = Object.assign({}, { name: 'name', props: 'props', attributes: 'attributes', children: 'children' }, state.opts);

            const NODE = path.node;

            if (!/JSXFragment/.test(NODE.type)) return NODE.expression ? NODE.expression : t.StringLiteral(NODE.value);

            const CHILDREN = path.get('children');

            let attributes = t.ObjectExpression([]),
                  children = CHILDREN.length ? t.ArrayExpression(CHILDREN.map(child => generateXSET(child, state))) : t.arrayExpression([]);

            return t.ObjectExpression([
                  t.ObjectProperty(t.StringLiteral(OPTIONS.name), t.StringLiteral("div")),
                  t.ObjectProperty(t.StringLiteral(OPTIONS.props), t.ObjectExpression([
                        t.ObjectProperty(t.StringLiteral(OPTIONS.attributes), attributes),
                        t.ObjectProperty(t.StringLiteral(OPTIONS.children), children)
                  ])),
            ]);
      }

      /**
       * @description - A function to generate XSET from the JSX.
       * 
       * @param {Object} path 
       * @param {Object} state 
       * @returns {Object}
       */
      function generateXSET(path, state) {
            const FILE = state.file,
                  OPTIONS = Object.assign({}, { name: 'name', props: 'props', attributes: 'attributes', children: 'children' }, state.opts);

            const NODE = path.node;

            if (!/JSXElement/.test(NODE.type)) return NODE.expression ? NODE.expression : t.StringLiteral(NODE.value);

            const OPENING_ELEMENT = NODE.openingElement,
                  CHILDREN = path.get('children'),
                  ELEMENT_ATTRIBUTES = OPENING_ELEMENT.attributes;

            let type = isUpperCase(OPENING_ELEMENT.name.name[0]) ? t.identifier(OPENING_ELEMENT.name.name) : t.StringLiteral(OPENING_ELEMENT.name.name),
                  attributes = ELEMENT_ATTRIBUTES.length ? buildAttributeObject(ELEMENT_ATTRIBUTES, FILE) : t.ObjectExpression([]),
                  children = CHILDREN.length ? t.ArrayExpression(CHILDREN.map(child => generateXSET(child, state))) : t.arrayExpression([]);

            return t.ObjectExpression([
                  t.ObjectProperty(t.StringLiteral(OPTIONS.name), type),
                  t.ObjectProperty(t.StringLiteral(OPTIONS.props), t.ObjectExpression([
                        t.ObjectProperty(t.StringLiteral(OPTIONS.attributes), attributes),
                        t.ObjectProperty(t.StringLiteral(OPTIONS.children), children)
                  ])),
            ]);
      }

      /**
       * @description - A function to generate Attributes from the JSX.
       * 
       * @param {Object} node 
       * @returns {Object}
       */
      const generateAttrObject = (nodes) => {
            let arr = nodes.map(node => {
                  let rawName = node.name.name;
                  let name = t.StringLiteral(rawName);
                  let value = (
                        !node.value ? t.BooleanLiteral(true) :
                              /JSXExpressionContainer/i.test(node.value.type) ? node.value.expression :
                                    node.value
                  );

                  return t.ObjectProperty(name, value);
            });

            return [t.ObjectExpression(arr)];
      };

      /**
       * @description - A function to generate Attribute Objects from the JSX.
       * 
       * @param {Object} attrs 
       * @param {Object} file 
       * @returns {Object}
       */
      const buildAttributeObject = function (attrs, file) {
            let _expressions = [],
                  _spreads = [];

            while (attrs.length) {
                  let attr = attrs.shift();

                  /^JSXSpreadAttribute$/i.test(attr.type) ? _spreads.push(attr.argument) : _expressions.push(attr);
            }

            let attrObject = _expressions.length ? generateAttrObject(_expressions) : null;

            if (_spreads.length) {
                  let extension = attrObject ? _spreads.concat(attrObject) : _spreads;

                  if (extension.length > 1) extension.unshift(t.ObjectExpression([]));

                  attrObject = t.callExpression(
                        file.addHelper('extends'),
                        extension
                  );
            } else {
                  attrObject = attrObject[0];
            }

            return attrObject;
      };


      /**
       * 
       * @param {Object} path 
       * @param {Object} state 
       * @returns 
       */
      function generateImportStatement(path, state) {
            const NODE = path.node;

            const source = NODE.source;
            const specifier = NODE.specifiers;

            const sourcePathArray = source.value.split("/").pop().split(".");

            /**
             * module css script
             */
            if (sourcePathArray[sourcePathArray.length - 1] === "css" && sourcePathArray[sourcePathArray.length - 2] === "module") {
                  const cssPath = pathModule.join(state.file.opts.filename, "../", source.value);
                  const css = fs.readFileSync(cssPath, 'utf8');
                  return t.variableDeclaration("const", [
                        t.variableDeclarator(t.identifier(specifier[0]?.local?.name), t.callExpression(t.identifier("XEON.create_module_css_from_utf_8"), [t.StringLiteral(sourcePathArray[0]), t.StringLiteral(css)]))
                  ]);
            }

            /**
             * css script
             */
            if (sourcePathArray[sourcePathArray.length - 1] === "css") {
                  const cssPath = pathModule.join(state.file.opts.filename, "../", source.value);
                  const css = fs.readFileSync(cssPath, 'utf8');
                  return t.callExpression(t.identifier("XEON.create_css_from_utf_8"), [t.StringLiteral(css)]);
            }

            /**
             * javascript extensions
             */
            const js_extensions = ["js", "jsx", "mjs", "cjs", "xjs"];

            js_extensions.forEach(extension => {
                  if (extension !== sourcePathArray[sourcePathArray.length - 1]) {
                        let is_file_exists = fs.existsSync(pathModule.join(state.file.opts.filename, "../", source.value + "." + extension));
                        if (is_file_exists) {
                              path = t.importDeclaration(specifier, t.StringLiteral(source.value + "." + extension));
                        }
                  }
            });

            return path;
      }




      return {
            inherits: require('babel-plugin-syntax-jsx'),
            visitor: {
                  JSXFragment: function (path, state) {
                        path.replaceWith(generateFragment(path, state));
                  },
                  JSXElement: function (path, state) {
                        path.replaceWith(generateXSET(path, state));
                  },
                  ImportDeclaration: function (path, state) {
                        path.replaceWith(generateImportStatement(path, state));
                  }
            }
      };
};