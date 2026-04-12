import type { NodeType } from "../../../features/designer/types";
import { AuthPropertiesForm } from "./AuthPropertiesForm";
import { DatabasePropertiesForm } from "./DatabasePropertiesForm";
import { EndpointPropertiesForm } from "./EndpointPropertiesForm";
import { EntityPropertiesForm } from "./EntityPropertiesForm";
import { ServicePropertiesForm } from "./ServicePropertiesForm";
import type {
  AuthProperties,
  DatabaseProperties,
  EndpointProperties,
  EntityProperties,
  NodeProperties,
  ServiceProperties,
} from "./types";

type NodePropertiesDispatcherProps = {
  nodeType: NodeType;
  value: NodeProperties;
  onChange: (next: NodeProperties) => void;
};

export function NodePropertiesDispatcher({ nodeType, value, onChange }: NodePropertiesDispatcherProps) {
  switch (nodeType) {
    case "entity":
      return <EntityPropertiesForm value={value as EntityProperties} onChange={(next) => onChange(next)} />;
    case "database":
      return <DatabasePropertiesForm value={value as DatabaseProperties} onChange={(next) => onChange(next)} />;
    case "service":
      return <ServicePropertiesForm value={value as ServiceProperties} onChange={(next) => onChange(next)} />;
    case "restEndpoint":
      return <EndpointPropertiesForm value={value as EndpointProperties} onChange={(next) => onChange(next)} />;
    case "jwtAuth":
    case "oauth2":
      return <AuthPropertiesForm value={value as AuthProperties} onChange={(next) => onChange(next)} />;
    default:
      return (
        <p className="rounded-md border border-slate-700 bg-slate-900 p-3 text-xs text-slate-400">
          No form available for this node type.
        </p>
      );
  }
}
