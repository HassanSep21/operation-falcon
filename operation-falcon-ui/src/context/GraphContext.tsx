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

interface GraphContextType {
  selectedNode: GraphNode | null;
  setSelectedNode: (node: GraphNode | null) => void;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export function GraphProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedNode, setSelectedNode] =
    useState<GraphNode | null>(null);

  return (
    <GraphContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
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
