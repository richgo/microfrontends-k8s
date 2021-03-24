"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remapInlineFragmentNodes = void 0;
const graphql_1 = require("graphql");
exports.default = {
    test(value) {
        return value && typeof value.kind === 'string';
    },
    serialize(value, _config, indentation, _depth, _refs, _printer) {
        return graphql_1.print(remapInlineFragmentNodes(value))
            .trim()
            .replace(/\n\n/g, '\n')
            .replace(/\n/g, '\n' + indentation);
    },
};
function remapInlineFragmentNodes(node) {
    return graphql_1.visit(node, {
        InlineFragment: (fragmentNode) => {
            if (fragmentNode.selectionSet)
                return fragmentNode;
            return {
                kind: graphql_1.Kind.INLINE_FRAGMENT,
                typeCondition: fragmentNode.typeCondition
                    ? {
                        kind: graphql_1.Kind.NAMED_TYPE,
                        name: {
                            kind: graphql_1.Kind.NAME,
                            value: fragmentNode.typeCondition,
                        },
                    }
                    : undefined,
                selectionSet: {
                    kind: graphql_1.Kind.SELECTION_SET,
                    selections: remapSelections(fragmentNode.selections),
                },
            };
        },
    });
}
exports.remapInlineFragmentNodes = remapInlineFragmentNodes;
function remapSelections(selections) {
    return selections.map((selection) => {
        switch (selection.kind) {
            case graphql_1.Kind.FIELD:
                return {
                    kind: graphql_1.Kind.FIELD,
                    name: {
                        kind: graphql_1.Kind.NAME,
                        value: selection.name,
                    },
                    selectionSet: {
                        kind: graphql_1.Kind.SELECTION_SET,
                        selections: remapSelections(selection.selections || []),
                    },
                };
            case graphql_1.Kind.INLINE_FRAGMENT:
                return {
                    kind: graphql_1.Kind.INLINE_FRAGMENT,
                    selectionSet: {
                        kind: graphql_1.Kind.SELECTION_SET,
                        selections: remapSelections(selection.selections || []),
                    },
                    typeCondition: selection.typeCondition
                        ? {
                            kind: graphql_1.Kind.NAMED_TYPE,
                            name: {
                                kind: graphql_1.Kind.NAME,
                                value: selection.typeCondition,
                            },
                        }
                        : undefined,
                };
        }
    });
}
//# sourceMappingURL=astSerializer.js.map