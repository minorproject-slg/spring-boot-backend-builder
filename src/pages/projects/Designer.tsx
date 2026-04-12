import { useMemo, useRef, useState, type DragEvent } from "react";
import { Link, Navigate, useParams } from "react-router";
import { useBuilderState } from "../../features/builder/store";
import type { NodeType } from "../../features/designer/types";
import {
  createDefaultProperties,
  NodePropertiesDispatcher,
  type NodeProperties,
} from "../../components/designer/properties";

type CatalogNode = {
  id: string;
  nodeType: NodeType;
  label: string;
  category: "Database" | "Logic" | "Auth" | "Integration";
  description: string;
};

const CATALOG_NODES: CatalogNode[] = [
  {
    id: "postgres",
    nodeType: "database",
    label: "PostgreSQL",
    category: "Database",
    description: "Relational persistence with Spring Data JPA.",
  },
  {
    id: "redis",
    nodeType: "database",
    label: "Redis Cache",
    category: "Database",
    description: "In-memory caching for read-heavy endpoints.",
  },
  {
    id: "workflow",
    nodeType: "service",
    label: "Workflow Rule",
    category: "Logic",
    description: "Branch business logic by condition and outcome.",
  },
  {
    id: "transform",
    nodeType: "service",
    label: "Payload Transform",
    category: "Logic",
    description: "Map payloads between API and domain contracts.",
  },
  {
    id: "jwt",
    nodeType: "jwtAuth",
    label: "JWT Guard",
    category: "Auth",
    description: "Token validation with role checks.",
  },
  {
    id: "oauth",
    nodeType: "oauth2",
    label: "OAuth2 Client",
    category: "Auth",
    description: "Federated login against identity providers.",
  },
  {
    id: "kafka",
    nodeType: "restEndpoint",
    label: "Kafka Producer",
    category: "Integration",
    description: "Publish domain events to external consumers.",
  },
  {
    id: "webhook",
    nodeType: "restEndpoint",
    label: "Webhook Outbound",
    category: "Integration",
    description: "Deliver signed HTTP callbacks to partners.",
  },
];

const CATEGORIES: Array<CatalogNode["category"]> = ["Database", "Logic", "Auth", "Integration"];
const NODE_WIDTH = 184;
const NODE_HEIGHT = 92;
const NODE_GAP = 20;

type CanvasNode = {
  id: string;
  catalogId: string;
  nodeType: NodeType;
  label: string;
  description: string;
  properties: NodeProperties;
  x: number;
  y: number;
};

export default function Designer() {
  const { projectId } = useParams();
  const state = useBuilderState();
  const [activeCatalogId, setActiveCatalogId] = useState(CATALOG_NODES[0].id);
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
  const [connections] = useState<Array<{ source: string; target: string }>>([]);
  const [selectedCanvasNodeId, setSelectedCanvasNodeId] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const canvasScrollRef = useRef<HTMLDivElement | null>(null);
  const canvasSurfaceRef = useRef<HTMLDivElement | null>(null);
  const nodeCounterRef = useRef(0);

  const activeCatalogNode = useMemo(
    () => CATALOG_NODES.find((node) => node.id === activeCatalogId) ?? CATALOG_NODES[0],
    [activeCatalogId],
  );
  const selectedCanvasNode = useMemo(
    () => canvasNodes.find((node) => node.id === selectedCanvasNodeId) ?? null,
    [canvasNodes, selectedCanvasNodeId],
  );
  const detailsNode = selectedCanvasNode
    ? {
        nodeType: selectedCanvasNode.nodeType,
        label: selectedCanvasNode.label,
        description: selectedCanvasNode.description,
        properties: selectedCanvasNode.properties,
      }
    : activeCatalogNode;

  const resolveCollisionPosition = (x: number, y: number, nodes: CanvasNode[]) => {
    let nextX = x;
    let nextY = y;
    let tries = 0;

    while (
      nodes.some(
        (node) =>
          Math.abs(node.x - nextX) < NODE_WIDTH + NODE_GAP && Math.abs(node.y - nextY) < NODE_HEIGHT + NODE_GAP,
      ) &&
      tries < 60
    ) {
      nextX += 28;
      nextY += 24;
      tries += 1;
    }

    return {
      x: Math.max(16, nextX),
      y: Math.max(16, nextY),
    };
  };

  const getSmartDefaultPosition = (nodes: CanvasNode[]) => {
    const scrollContainer = canvasScrollRef.current;
    const surface = canvasSurfaceRef.current;

    if (!scrollContainer || !surface) {
      const index = nodes.length;
      return resolveCollisionPosition(48 + (index % 4) * 220, 72 + Math.floor(index / 4) * 160, nodes);
    }

    const visibleCenterX = scrollContainer.scrollLeft + scrollContainer.clientWidth / 2;
    const visibleCenterY = scrollContainer.scrollTop + scrollContainer.clientHeight / 2;
    const nextX = visibleCenterX - NODE_WIDTH / 2;
    const nextY = visibleCenterY - NODE_HEIGHT / 2;

    return resolveCollisionPosition(nextX, nextY, nodes);
  };

  const addCanvasNode = (catalogNode: CatalogNode, preferredPosition?: { x: number; y: number }) => {
    setCanvasNodes((previousNodes) => {
      const placement = preferredPosition
        ? resolveCollisionPosition(preferredPosition.x, preferredPosition.y, previousNodes)
        : getSmartDefaultPosition(previousNodes);
      const nextId = `${catalogNode.id}-${nodeCounterRef.current}`;
      nodeCounterRef.current += 1;
      const nextNode: CanvasNode = {
        id: nextId,
        catalogId: catalogNode.id,
        nodeType: catalogNode.nodeType,
        label: catalogNode.label,
        description: catalogNode.description,
        properties: createDefaultProperties(catalogNode.nodeType, catalogNode.label),
        x: placement.x,
        y: placement.y,
      };

      setActiveCatalogId(catalogNode.id);
      setSelectedCanvasNodeId(nextId);
      setRightOpen(true);

      return [...previousNodes, nextNode];
    });
  };

  const handleSidebarDragStart = (event: DragEvent<HTMLButtonElement>, nodeId: string) => {
    event.dataTransfer.setData("application/x-catalog-node", nodeId);
    event.dataTransfer.effectAllowed = "copy";
    setActiveCatalogId(nodeId);
  };

  const handleCanvasDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedNodeId = event.dataTransfer.getData("application/x-catalog-node");
    const droppedNode = CATALOG_NODES.find((node) => node.id === droppedNodeId);
    const canvasRect = event.currentTarget.getBoundingClientRect();

    if (!droppedNode) {
      return;
    }

    addCanvasNode(droppedNode, {
      x: event.clientX - canvasRect.left - NODE_WIDTH / 2,
      y: event.clientY - canvasRect.top - NODE_HEIGHT / 2,
    });
  };

  if (!projectId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1800px] items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setLeftOpen((open) => !open)}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 lg:hidden"
          >
            Catalog
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-400">Projects / {projectId} / Designer</p>
            <h1 className="truncate text-sm font-semibold sm:text-base">
              {state.draft.project.name?.trim() || "Untitled project"}
            </h1>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 sm:flex">
            <span>Nodes: {canvasNodes.length}</span>
            <span className="text-slate-600">|</span>
            <span>Connections: {connections.length}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSaveStatus("saved");
              window.setTimeout(() => setSaveStatus("idle"), 1600);
            }}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
          >
            {saveStatus === "saved" ? "Saved" : "Save"}
          </button>
          <Link
            to={`/projects/${projectId}/review`}
            className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500"
          >
            Generate Code
          </Link>

          <button
            type="button"
            onClick={() => setRightOpen((open) => !open)}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 lg:hidden"
          >
            Properties
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1800px] flex-1 grid-cols-1 gap-0 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside
          className={`${leftOpen ? "block" : "hidden"} border-b border-slate-800 bg-slate-900/70 lg:block lg:border-b-0 lg:border-r`}
        >
          <div className="h-full p-4">
            <h2 className="mb-4 text-sm font-semibold text-slate-200">Component catalog</h2>
            <div className="space-y-5">
              {CATEGORIES.map((category) => (
                <section key={category}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{category}</h3>
                  <div className="space-y-2">
                    {CATALOG_NODES.filter((node) => node.category === category).map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        draggable
                        onDragStart={(event) => handleSidebarDragStart(event, node.id)}
                        onClick={() => addCanvasNode(node)}
                        className={`w-full rounded-lg border p-3 text-left text-xs transition ${
                          activeCatalogNode.id === node.id
                            ? "border-sky-500 bg-sky-500/10 text-sky-100"
                            : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <p className="font-semibold">{node.label}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{node.description}</p>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </aside>

        <section className="relative min-h-[60vh] border-b border-slate-800 lg:border-b-0 lg:border-r">
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "#020617",
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.2) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div ref={canvasScrollRef} className="relative h-full min-h-[60vh] overflow-auto p-6">
            <div
              ref={canvasSurfaceRef}
              onDrop={handleCanvasDrop}
              onDragOver={(event) => event.preventDefault()}
              className="relative min-h-[900px] min-w-[900px] rounded-xl border border-slate-800/80 bg-slate-950/40 p-4"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">Infinite canvas</p>
              <div className="mt-4 inline-flex items-center rounded-md border border-sky-600/60 bg-sky-500/15 px-3 py-2 text-xs text-sky-100">
                Selected: {detailsNode.label}
              </div>
              {canvasNodes.map((node) => {
                const isSelected = node.id === selectedCanvasNodeId;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      setSelectedCanvasNodeId(node.id);
                      setActiveCatalogId(node.catalogId);
                      setRightOpen(true);
                    }}
                    className={`absolute rounded-lg border px-3 py-2 text-left shadow-lg transition ${
                      isSelected
                        ? "border-sky-400 bg-sky-500/20 text-sky-50"
                        : "border-slate-700 bg-slate-900/95 text-slate-100 hover:border-slate-500"
                    }`}
                    style={{ left: node.x, top: node.y, width: `${NODE_WIDTH}px`, minHeight: `${NODE_HEIGHT}px` }}
                  >
                    <p className="text-xs font-semibold">{node.label}</p>
                    <p className="mt-1 text-[11px] text-slate-300">{node.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <aside
          className={`${rightOpen ? "block" : "hidden"} border-b border-slate-800 bg-slate-900/70 lg:block lg:border-b-0`}
        >
          <div className="h-full p-4">
            <h2 className="text-sm font-semibold text-slate-200">Properties</h2>
            <p className="mt-1 text-xs text-slate-400">Configure settings for the selected node.</p>

            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Node</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{detailsNode.label}</p>
              <p className="mt-1 text-xs text-slate-400">{detailsNode.description}</p>
            </div>

            <div className="mt-3 space-y-3">
              {selectedCanvasNode ? (
                <NodePropertiesDispatcher
                  nodeType={selectedCanvasNode.nodeType}
                  value={selectedCanvasNode.properties}
                  onChange={(nextProperties) => {
                    setCanvasNodes((nodes) =>
                      nodes.map((node) =>
                        node.id === selectedCanvasNode.id ? { ...node, properties: nextProperties } : node,
                      ),
                    );
                  }}
                />
              ) : (
                <p className="rounded-md border border-slate-700 bg-slate-900 p-3 text-xs text-slate-400">
                  Select a node on the canvas to edit detailed properties.
                </p>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
