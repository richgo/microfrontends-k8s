"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteGraphQLDataSource = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const apollo_server_env_1 = require("apollo-server-env");
const predicates_1 = require("../utilities/predicates");
const createSHA_1 = __importDefault(require("apollo-server-core/dist/utils/createSHA"));
class RemoteGraphQLDataSource {
    constructor(config) {
        this.fetcher = apollo_server_env_1.fetch;
        this.apq = false;
        if (config) {
            return Object.assign(this, config);
        }
    }
    async process({ request, context, }) {
        const headers = (request.http && request.http.headers) || new apollo_server_env_1.Headers();
        headers.set('Content-Type', 'application/json');
        request.http = {
            method: 'POST',
            url: this.url,
            headers,
        };
        if (this.willSendRequest) {
            await this.willSendRequest({ request, context });
        }
        if (!request.query) {
            throw new Error("Missing query");
        }
        const apqHash = createSHA_1.default('sha256')
            .update(request.query)
            .digest('hex');
        const { query, ...requestWithoutQuery } = request;
        const respond = (response, request) => typeof this.didReceiveResponse === "function"
            ? this.didReceiveResponse({ response, request, context })
            : response;
        if (this.apq) {
            requestWithoutQuery.extensions = {
                ...request.extensions,
                persistedQuery: {
                    version: 1,
                    sha256Hash: apqHash,
                },
            };
            const apqOptimisticResponse = await this.sendRequest(requestWithoutQuery, context);
            if (!apqOptimisticResponse.errors ||
                !apqOptimisticResponse.errors.find(error => error.message === 'PersistedQueryNotFound')) {
                return respond(apqOptimisticResponse, requestWithoutQuery);
            }
        }
        const requestWithQuery = {
            query,
            ...requestWithoutQuery,
        };
        const response = await this.sendRequest(requestWithQuery, context);
        return respond(response, requestWithQuery);
    }
    async sendRequest(request, context) {
        if (!request.http) {
            throw new Error("Internal error: Only 'http' requests are supported.");
        }
        const { http, ...requestWithoutHttp } = request;
        const fetchRequest = new apollo_server_env_1.Request(http.url, {
            ...http,
            body: JSON.stringify(requestWithoutHttp),
        });
        let fetchResponse;
        try {
            fetchResponse = await this.fetcher(http.url, {
                ...http,
                body: JSON.stringify(requestWithoutHttp)
            });
            if (!fetchResponse.ok) {
                throw await this.errorFromResponse(fetchResponse);
            }
            const body = await this.parseBody(fetchResponse, fetchRequest, context);
            if (!predicates_1.isObject(body)) {
                throw new Error(`Expected JSON response body, but received: ${body}`);
            }
            return {
                ...body,
                http: fetchResponse,
            };
        }
        catch (error) {
            this.didEncounterError(error, fetchRequest, fetchResponse);
            throw error;
        }
    }
    didEncounterError(error, _fetchRequest, _fetchResponse) {
        throw error;
    }
    parseBody(fetchResponse, _fetchRequest, _context) {
        const contentType = fetchResponse.headers.get('Content-Type');
        if (contentType && contentType.startsWith('application/json')) {
            return fetchResponse.json();
        }
        else {
            return fetchResponse.text();
        }
    }
    async errorFromResponse(response) {
        const message = `${response.status}: ${response.statusText}`;
        let error;
        if (response.status === 401) {
            error = new apollo_server_errors_1.AuthenticationError(message);
        }
        else if (response.status === 403) {
            error = new apollo_server_errors_1.ForbiddenError(message);
        }
        else {
            error = new apollo_server_errors_1.ApolloError(message);
        }
        const body = await this.parseBody(response);
        Object.assign(error.extensions, {
            response: {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                body,
            },
        });
        return error;
    }
}
exports.RemoteGraphQLDataSource = RemoteGraphQLDataSource;
//# sourceMappingURL=RemoteGraphQLDataSource.js.map