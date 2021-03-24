"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOperationContext = exports.buildQueryPlan = void 0;
const graphql_1 = require("graphql");
const query_planner_wasm_1 = require("@apollo/query-planner-wasm");
function buildQueryPlan(operationContext, options = { autoFragmentization: false }) {
    return query_planner_wasm_1.getQueryPlan(operationContext.queryPlannerPointer, operationContext.operationString, options);
}
exports.buildQueryPlan = buildQueryPlan;
;
function buildOperationContext({ schema, operationDocument, operationString, queryPlannerPointer, operationName, }) {
    let operation;
    let operationCount = 0;
    const fragments = Object.create(null);
    operationDocument.definitions.forEach(definition => {
        switch (definition.kind) {
            case graphql_1.Kind.OPERATION_DEFINITION:
                operationCount++;
                if (!operationName && operationCount > 1) {
                    throw new graphql_1.GraphQLError('Must provide operation name if query contains ' +
                        'multiple operations.');
                }
                if (!operationName ||
                    (definition.name && definition.name.value === operationName)) {
                    operation = definition;
                }
                break;
            case graphql_1.Kind.FRAGMENT_DEFINITION:
                fragments[definition.name.value] = definition;
                break;
        }
    });
    if (!operation) {
        if (operationName) {
            throw new graphql_1.GraphQLError(`Unknown operation named "${operationName}".`);
        }
        else {
            throw new graphql_1.GraphQLError('Must provide an operation.');
        }
    }
    const trimmedOperationString = operationCount > 1
        ? graphql_1.print({
            kind: graphql_1.Kind.DOCUMENT,
            definitions: [
                operation,
                ...Object.values(fragments),
            ],
        })
        : operationString;
    return {
        schema,
        operation,
        fragments,
        queryPlannerPointer,
        operationString: trimmedOperationString
    };
}
exports.buildOperationContext = buildOperationContext;
//# sourceMappingURL=buildQueryPlan.js.map