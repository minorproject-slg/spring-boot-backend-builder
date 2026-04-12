import type { NodeType } from "../../../features/designer/types";

export type EntityField = {
  name: string;
  type: string;
  constraints: string;
};

export type ServiceMethod = {
  name: string;
  transactional: boolean;
};

export type EntityProperties = {
  tableName: string;
  fields: EntityField[];
};

export type DatabaseProperties = {
  engine: string;
  host: string;
  port: string;
  dbName: string;
  username: string;
  sslEnabled: boolean;
};

export type ServiceProperties = {
  serviceName: string;
  methods: ServiceMethod[];
};

export type EndpointProperties = {
  path: string;
  httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  authRequired: boolean;
  requestMapping: string;
  responseMapping: string;
};

export type AuthProperties = {
  provider: "jwt" | "oauth2";
  issuer: string;
  audience: string;
  jwksUrl: string;
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  scopes: string;
};

export type NodeProperties =
  | EntityProperties
  | DatabaseProperties
  | ServiceProperties
  | EndpointProperties
  | AuthProperties;

export const createDefaultProperties = (nodeType: NodeType, label: string): NodeProperties => {
  switch (nodeType) {
    case "entity":
      return {
        tableName: label.toLowerCase().replace(/\s+/g, "_"),
        fields: [{ name: "id", type: "UUID", constraints: "PRIMARY KEY" }],
      };
    case "database":
      return {
        engine: "postgresql",
        host: "localhost",
        port: "5432",
        dbName: "app_db",
        username: "postgres",
        sslEnabled: false,
      };
    case "service":
      return {
        serviceName: label.replace(/\s+/g, ""),
        methods: [{ name: "create", transactional: true }],
      };
    case "restEndpoint":
      return {
        path: "/api/resource",
        httpMethod: "GET",
        authRequired: true,
        requestMapping: "RequestDto -> DomainModel",
        responseMapping: "DomainModel -> ResponseDto",
      };
    case "jwtAuth":
      return {
        provider: "jwt",
        issuer: "spring-builder",
        audience: "api",
        jwksUrl: "",
        clientId: "",
        clientSecret: "",
        tokenUrl: "",
        scopes: "read write",
      };
    case "oauth2":
      return {
        provider: "oauth2",
        issuer: "",
        audience: "",
        jwksUrl: "",
        clientId: "web-client",
        clientSecret: "",
        tokenUrl: "https://provider.example.com/oauth/token",
        scopes: "openid profile email",
      };
    default:
      return {
        serviceName: label.replace(/\s+/g, ""),
        methods: [{ name: "execute", transactional: false }],
      };
  }
};
