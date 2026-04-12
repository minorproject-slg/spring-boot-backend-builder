export const FIELD_TYPES = [
  "string",
  "text",
  "integer",
  "long",
  "float",
  "double",
  "decimal",
  "boolean",
  "date",
  "datetime",
  "uuid",
  "json",
  "enum",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const RELATION_KINDS = [
  "one-to-one",
  "one-to-many",
  "many-to-one",
  "many-to-many",
] as const;

export type RelationKind = (typeof RELATION_KINDS)[number];

export const AUTH_TYPES = ["none", "jwt", "basic", "oauth2"] as const;

export type AuthType = (typeof AUTH_TYPES)[number];

export const DATABASE_ENGINES = [
  "postgresql",
  "mysql",
  "mariadb",
  "sqlserver",
  "oracle",
  "h2",
  "mongodb",
] as const;

export type DatabaseEngine = (typeof DATABASE_ENGINES)[number];

export interface BuilderProject {
  name: string;
  groupId: string;
  artifactId: string;
  javaVersion: string;
  springBootVersion: string;
}

export interface FieldValidation {
  required?: boolean;
  unique?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface EntityField {
  name: string;
  type: FieldType;
  validation?: FieldValidation;
  defaultValue?: string | number | boolean | null;
}

export interface EntityRelation {
  name: string;
  kind: RelationKind;
  targetEntity: string;
  mappedBy?: string;
  optional?: boolean;
}

export interface EntityDefinition {
  name: string;
  fields: EntityField[];
  relations?: EntityRelation[];
}

export interface CrudToggles {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface CustomEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  summary?: string;
}

export interface ApiResource {
  entityName: string;
  crud: CrudToggles;
  customEndpoints?: CustomEndpoint[];
}

export interface SecurityConfig {
  authType: AuthType;
  roles: string[];
  jwtEnabled: boolean;
  basicEnabled: boolean;
}

export interface DatabaseConnectionProfile {
  name: string;
  url?: string;
  username?: string;
  password?: string;
}

export interface DatabaseConfig {
  engine: DatabaseEngine;
  connectionProfile: DatabaseConnectionProfile;
}

export interface BuilderDesign {
  project: BuilderProject;
  entities: EntityDefinition[];
  apiResources: ApiResource[];
  security: SecurityConfig;
  database: DatabaseConfig;
}
