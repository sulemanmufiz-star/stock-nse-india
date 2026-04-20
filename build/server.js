"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const graphql_1 = require("graphql");
const load_1 = require("@graphql-tools/load");
const load_files_1 = require("@graphql-tools/load-files");
const merge_1 = require("@graphql-tools/merge");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const swaggerDocOptions_1 = require("./swaggerDocOptions");
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const hostUrl = process.env.HOST_URL || `http://localhost:${port}`;
// CORS Configuration from environment variables
// CORS_ORIGINS: Comma-separated list of allowed origins
// CORS_METHODS: Comma-separated list of allowed HTTP methods  
// CORS_HEADERS: Comma-separated list of allowed headers
// CORS_CREDENTIALS: Enable/disable credentials (default: true)
// Enable CORS for all routes
const corsOrigins = process.env.CORS_ORIGINS ?
    process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) :
    [];
const corsMethods = process.env.CORS_METHODS ?
    process.env.CORS_METHODS.split(',').map(method => method.trim()) :
    ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const corsHeaders = process.env.CORS_HEADERS ?
    process.env.CORS_HEADERS.split(',').map(header => header.trim()) :
    ['Content-Type', 'Authorization'];
app.use((0, cors_1.default)({
    origin: [
        ...corsOrigins,
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/ // Allow any 127.0.0.1 port
    ],
    methods: corsMethods,
    allowedHeaders: corsHeaders,
    credentials: process.env.CORS_CREDENTIALS !== 'false'
}));
// Add JSON body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.mainRouter);
app.use('/api-docs', swagger_ui_express_1.default.serve);
app.use('/api-docs', swagger_ui_express_1.default.setup(swaggerDocOptions_1.openapiSpecification));
const loadedTypeDefs = (0, load_1.loadSchemaSync)(path_1.default.join(__dirname, './**/*.graphql'), { loaders: [new graphql_file_loader_1.GraphQLFileLoader()] });
const loadedResolvers = (0, load_files_1.loadFilesSync)(path_1.default.join(__dirname, './**/*.resolver.{ts,js}'));
const typeDefs = (0, merge_1.mergeTypeDefs)(loadedTypeDefs);
if (process.env.NODE_ENV === 'development') {
    console.log('\n=== GraphQL Schema Start ===\n');
    const printedTypeDefs = (0, graphql_1.print)(typeDefs);
    console.log(printedTypeDefs);
    console.log('\n=== GraphQL Schema End ===\n');
}
const resolvers = (0, merge_1.mergeResolvers)(loadedResolvers);
const httpServer = http_1.default.createServer(app);
const server = new apollo_server_express_1.ApolloServer({
    typeDefs,
    resolvers,
    plugins: [(0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer })]
});
server.start().then(() => {
    server.applyMiddleware({ app });
    app.listen(port, () => {
        console.log(`NseIndia App started in port ${port}`);
        console.log(`For API docs: ${hostUrl}/api-docs`);
        console.log(`Open ${hostUrl} in browser.`);
        console.log(`For graphql: ${hostUrl}${server.graphqlPath}`);
        // Log CORS configuration
        if (corsOrigins.length > 0) {
            console.log(`CORS Origins: ${corsOrigins.join(', ')}`);
        }
        console.log(`CORS Methods: ${corsMethods.join(', ')}`);
        console.log(`CORS Headers: ${corsHeaders.join(', ')}`);
        console.log(`CORS Credentials: ${process.env.CORS_CREDENTIALS !== 'false'}`);
    });
});
//# sourceMappingURL=server.js.map