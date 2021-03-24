"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csdlToSchema = void 0;
const graphql_1 = require("graphql");
function csdlToSchema(csdl) {
    let schema = new graphql_1.GraphQLSchema({
        query: undefined,
    });
    const parsed = graphql_1.parse(csdl);
    return graphql_1.extendSchema(schema, parsed, { assumeValidSDL: true });
}
exports.csdlToSchema = csdlToSchema;
//# sourceMappingURL=csdlToSchema.js.map