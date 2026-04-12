export type NodeType =
  | 'entity'
  | 'database'
  | 'service'
  | 'restEndpoint'
  | 'jwtAuth'
  | 'oauth2'
  | 'graphql';

export type RelationType =
  | 'uses'
  | 'owns'
  | 'dependsOn'
  | 'exposes'
  | 'secures'
  | 'readsFrom'
  | 'writesTo';

export type NodePosition = {
  x: number;
  y: number;
};

export type NodeConfig = Record<string, unknown>;

export type DesignerNode = {
  id: string;
  type: NodeType;
  position: NodePosition;
  label: string;
  config: NodeConfig;
};

export type EdgeValidationMetadata = {
  isValid: boolean;
  reason?: string;
  validatedAt?: string;
};

export type DesignerEdge = {
  source: string;
  target: string;
  relationType: RelationType;
  validation: EdgeValidationMetadata;
};

export type DesignerProjectState = {
  nodes: DesignerNode[];
  edges: DesignerEdge[];
  selectedNodeId: string | null;
  version: number;
  isDirty: boolean;
};

const ALLOWED_NODE_CONNECTIONS: Record<NodeType, NodeType[]> = {
  entity: ['database', 'service', 'graphql'],
  database: ['entity', 'service'],
  service: ['entity', 'database', 'jwtAuth', 'oauth2', 'graphql'],
  restEndpoint: ['service', 'jwtAuth', 'oauth2'],
  jwtAuth: ['service', 'restEndpoint', 'graphql'],
  oauth2: ['service', 'restEndpoint', 'graphql'],
  graphql: ['service', 'entity', 'jwtAuth', 'oauth2'],
};

export const isAllowedConnection = (
  sourceType: NodeType,
  targetType: NodeType,
): boolean => ALLOWED_NODE_CONNECTIONS[sourceType].includes(targetType);

export const getAllowedTargetTypes = (sourceType: NodeType): NodeType[] =>
  ALLOWED_NODE_CONNECTIONS[sourceType];

export const validateNodeConnection = (
  source: DesignerNode,
  target: DesignerNode,
): EdgeValidationMetadata => {
  const isValid = isAllowedConnection(source.type, target.type);

  if (isValid) {
    return {
      isValid: true,
      validatedAt: new Date().toISOString(),
    };
  }

  return {
    isValid: false,
    reason: `Connection not allowed: ${source.type} -> ${target.type}`,
    validatedAt: new Date().toISOString(),
  };
};
