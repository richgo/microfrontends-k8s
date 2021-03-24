"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSelections = exports.printWithReducedWhitespace = exports.astFromType = exports.allNodesAreOfSameKind = exports.getResponseName = void 0;
const graphql_1 = require("graphql");
function getResponseName(node) {
    return node.alias ? node.alias.value : node.name.value;
}
exports.getResponseName = getResponseName;
function allNodesAreOfSameKind(firstNode, remainingNodes) {
    return !remainingNodes.some(node => node.kind !== firstNode.kind);
}
exports.allNodesAreOfSameKind = allNodesAreOfSameKind;
function astFromType(type) {
    if (graphql_1.isListType(type)) {
        return { kind: graphql_1.Kind.LIST_TYPE, type: astFromType(type.ofType) };
    }
    else if (graphql_1.isNonNullType(type)) {
        return { kind: graphql_1.Kind.NON_NULL_TYPE, type: astFromType(type.ofType) };
    }
    else {
        return {
            kind: graphql_1.Kind.NAMED_TYPE,
            name: { kind: graphql_1.Kind.NAME, value: type.name },
        };
    }
}
exports.astFromType = astFromType;
function printWithReducedWhitespace(ast) {
    return graphql_1.print(ast)
        .replace(/\s+/g, ' ')
        .trim();
}
exports.printWithReducedWhitespace = printWithReducedWhitespace;
function parseSelections(source) {
    return graphql_1.parse(`query { ${source} }`)
        .definitions[0].selectionSet.selections;
}
exports.parseSelections = parseSelections;
//# sourceMappingURL=graphql.js.map