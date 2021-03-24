import { GraphQLRequestContext, GraphQLResponse, ValueOrPromise } from 'apollo-server-types';
import { ApolloError } from 'apollo-server-errors';
import { fetch, Request, Response } from 'apollo-server-env';
import { GraphQLDataSource } from './types';
export declare class RemoteGraphQLDataSource<TContext extends Record<string, any> = Record<string, any>> implements GraphQLDataSource<TContext> {
    fetcher: typeof fetch;
    constructor(config?: Partial<RemoteGraphQLDataSource<TContext>> & object & ThisType<RemoteGraphQLDataSource<TContext>>);
    url: string;
    apq: boolean;
    process({ request, context, }: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>): Promise<GraphQLResponse>;
    private sendRequest;
    willSendRequest?(requestContext: Pick<GraphQLRequestContext<TContext>, 'request' | 'context'>): ValueOrPromise<void>;
    didReceiveResponse?(requestContext: Required<Pick<GraphQLRequestContext<TContext>, 'request' | 'response' | 'context'>>): ValueOrPromise<GraphQLResponse>;
    didEncounterError(error: Error, _fetchRequest: Request, _fetchResponse?: Response): void;
    parseBody(fetchResponse: Response, _fetchRequest?: Request, _context?: TContext): Promise<object | string>;
    errorFromResponse(response: Response): Promise<ApolloError>;
}
//# sourceMappingURL=RemoteGraphQLDataSource.d.ts.map