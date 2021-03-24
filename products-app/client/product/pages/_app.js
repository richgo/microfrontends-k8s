import withApollo from 'next-with-apollo';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
const { NEXT_PUBLIC_GRAPH_URL } = process.env

 
const App = ({ Component, pageProps, apollo }) => (
    <ApolloProvider client={apollo}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
   
  export default withApollo(({ initialState }) => {
    return new ApolloClient({
        uri: NEXT_PUBLIC_GRAPH_URL,
        cache: new InMemoryCache().restore(initialState || {})
    });
  })(App);