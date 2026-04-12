import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { BuilderDesign, BuilderProject, EntityField, EntityDefinition, SecurityConfig } from "./model";
import { validateProjectMetadata } from "./validation";

const BUILDER_STORAGE_KEY = "spring-builder:draft:v1";

export interface BuilderState {
  draft: BuilderDesign;
  dependencies: string[];
}

export type BuilderAction =
  | { type: "createProject"; payload: BuilderProject }
  | { type: "addEntity"; payload: EntityDefinition }
  | {
      type: "updateField";
      payload: {
        entityName: string;
        fieldName: string;
        patch: Partial<EntityField>;
      };
    }
  | { type: "setSecurity"; payload: SecurityConfig }
  | { type: "setDependencies"; payload: string[] }
  | { type: "resetDraft" };

const DEFAULT_STATE: BuilderState = {
  draft: {
    project: {
      name: "",
      groupId: "",
      artifactId: "",
      javaVersion: "21",
      springBootVersion: "3.3.5",
    },
    entities: [],
    apiResources: [],
    security: {
      authType: "none",
      roles: [],
      jwtEnabled: false,
      basicEnabled: false,
    },
    database: {
      engine: "postgresql",
      connectionProfile: {
        name: "default",
      },
    },
  },
  dependencies: ["spring-boot-starter-web", "spring-boot-starter-data-jpa"],
};

const BuilderStateContext = createContext<BuilderState | null>(null);
const BuilderDispatchContext = createContext<Dispatch<BuilderAction> | null>(null);

const builderReducer = (state: BuilderState, action: BuilderAction): BuilderState => {
  switch (action.type) {
    case "createProject":
      return {
        ...state,
        draft: {
          ...state.draft,
          project: action.payload,
        },
      };
    case "addEntity":
      return {
        ...state,
        draft: {
          ...state.draft,
          entities: [...state.draft.entities, action.payload],
        },
      };
    case "updateField":
      return {
        ...state,
        draft: {
          ...state.draft,
          entities: state.draft.entities.map((entity) => {
            if (entity.name !== action.payload.entityName) {
              return entity;
            }

            return {
              ...entity,
              fields: entity.fields.map((field) => {
                if (field.name !== action.payload.fieldName) {
                  return field;
                }

                return {
                  ...field,
                  ...action.payload.patch,
                };
              }),
            };
          }),
        },
      };
    case "setSecurity":
      return {
        ...state,
        draft: {
          ...state.draft,
          security: action.payload,
        },
      };
    case "setDependencies":
      return {
        ...state,
        dependencies: action.payload,
      };
    case "resetDraft":
      return DEFAULT_STATE;
    default:
      return state;
  }
};

const loadState = (): BuilderState => {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  const rawValue = window.localStorage.getItem(BUILDER_STORAGE_KEY);

  if (!rawValue) {
    return DEFAULT_STATE;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<BuilderState>;

    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_STATE;
    }

    return {
      draft: parsed.draft ?? DEFAULT_STATE.draft,
      dependencies: Array.isArray(parsed.dependencies)
        ? parsed.dependencies.filter((dependency): dependency is string => typeof dependency === "string")
        : DEFAULT_STATE.dependencies,
    };
  } catch {
    return DEFAULT_STATE;
  }
};

export function BuilderStoreProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(builderReducer, DEFAULT_STATE, loadState);

  useEffect(() => {
    window.localStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <BuilderStateContext.Provider value={state}>
      <BuilderDispatchContext.Provider value={dispatch}>{children}</BuilderDispatchContext.Provider>
    </BuilderStateContext.Provider>
  );
}

export const useBuilderState = (): BuilderState => {
  const context = useContext(BuilderStateContext);

  if (!context) {
    throw new Error("useBuilderState must be used within BuilderStoreProvider");
  }

  return context;
};

export const useBuilderDispatch = (): Dispatch<BuilderAction> => {
  const context = useContext(BuilderDispatchContext);

  if (!context) {
    throw new Error("useBuilderDispatch must be used within BuilderStoreProvider");
  }

  return context;
};

export const selectEntityCount = (state: BuilderState): number => state.draft.entities.length;

export const selectEndpointCount = (state: BuilderState): number =>
  state.draft.apiResources.reduce((total, resource) => {
    const crudCount = Object.values(resource.crud).filter(Boolean).length;
    const customCount = resource.customEndpoints?.length ?? 0;

    return total + crudCount + customCount;
  }, 0);

export const selectValidationWarnings = (state: BuilderState): string[] => {
  const warnings: string[] = [...validateProjectMetadata(state.draft.project)];

  if (state.draft.entities.length === 0) {
    warnings.push("Add at least one entity before generating.");
  }

  for (const entity of state.draft.entities) {
    if (entity.fields.length === 0) {
      warnings.push(`Entity \"${entity.name}\" requires at least one field.`);
    }
  }

  if (selectEndpointCount(state) === 0) {
    warnings.push("Add at least one endpoint (CRUD or custom) before generating.");
  }

  if (!state.dependencies.includes("spring-boot-starter-web")) {
    warnings.push("Dependency spring-boot-starter-web is recommended for REST generation.");
  }

  return warnings;
};

export const selectReadinessStatus = (state: BuilderState): "ready" | "needs-attention" =>
  selectValidationWarnings(state).length === 0 ? "ready" : "needs-attention";

export const useBuilderSelectors = () => {
  const state = useBuilderState();

  return useMemo(
    () => ({
      entityCount: selectEntityCount(state),
      endpointCount: selectEndpointCount(state),
      validationWarnings: selectValidationWarnings(state),
      readinessStatus: selectReadinessStatus(state),
    }),
    [state],
  );
};
