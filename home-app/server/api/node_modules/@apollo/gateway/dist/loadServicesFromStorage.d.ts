import { fetch } from 'apollo-server-env';
import { Experimental_UpdateServiceDefinitions } from '.';
interface ImplementingServiceLocation {
    name: string;
    path: string;
}
export interface CompositionMetadata {
    formatVersion: number;
    id: string;
    implementingServiceLocations: ImplementingServiceLocation[];
    schemaHash: string;
}
export declare function getServiceDefinitionsFromStorage({ graphId, apiKeyHash, graphVariant, federationVersion, fetcher, }: {
    graphId: string;
    apiKeyHash: string;
    graphVariant: string;
    federationVersion: number;
    fetcher: typeof fetch;
}): ReturnType<Experimental_UpdateServiceDefinitions>;
export {};
//# sourceMappingURL=loadServicesFromStorage.d.ts.map