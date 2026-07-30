import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface GraphNode {
  id: string;
  label: string;
  properties: Record<string, unknown>;
}

export interface GraphObject {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
}

interface GraphContextType {
    selectedNode: GraphNode | null;
    setSelectedNode: (node: GraphNode | null) => void;

    highlightedNodes: string[];
    setHighlightedNodes: React.Dispatch<React.SetStateAction<string[]>>;

    objects: GraphObject[];
    setObjects: (objects: GraphObject[]) => void;

    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export function GraphProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedNode, setSelectedNode] =
    useState<GraphNode | null>(null);
  const [highlightedNodes, setHighlightedNodes] =
    useState<string[]>([]);
  const [objects, setObjects] = useState<GraphObject[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <GraphContext.Provider
      value={{
        selectedNode,
        setSelectedNode,

        highlightedNodes,
        setHighlightedNodes,

        objects,
        setObjects,

        selectedNodeId,
        setSelectedNodeId,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);

  if (!context) {
    throw new Error("useGraph must be used inside GraphProvider");
  }

  return context;
}
