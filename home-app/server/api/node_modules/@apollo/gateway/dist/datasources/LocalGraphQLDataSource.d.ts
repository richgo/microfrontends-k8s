import { GraphQLRequestContext, GraphQLResponse } from 'apollo-server-types';
import { GraphQLSchema, DocumentNode } from 'graphql';
import { GraphQLDataSource } from './types';
export declare class LocalGraphQLDataSource<TContext extends Record<string, any> = Record<string, any>> implements GraphQLDataSource<TContext> {
    readonly schema: GraphQLSchema;
    constructor(schema: GraphQLSchema);
    process({ request, context, }: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>): Promise<GraphQLResponse>;
    sdl(): DocumentNode;
}
//# sourceMappingURL=LocalGraphQLDataSource.d.ts.map