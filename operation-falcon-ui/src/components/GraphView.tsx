import { useEffect, useState } from "react";
import { useGraph } from "../context/GraphContext";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import type { Edge, Node } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import dagre from "@dagrejs/dagre";

import { getGraph } from "../api/api";
import type { GraphRecord } from "../types/graph";

const g = new dagre.graphlib.Graph();

g.setDefaultEdgeLabel(() => ({}));

g.setGraph({
  rankdir: "LR",
  ranksep: 120,
  nodesep: 70,
});

export default function GraphView() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { setSelectedNode } = useGraph();

  useEffect(() => {
    async function load() {
      const records: GraphRecord[] = await getGraph();

      const nodeMap = new Map<string, Node>();
      const edgeList: Edge[] = [];

      records.forEach((record) => {
        if (!nodeMap.has(record.source_id)) {
          nodeMap.set(record.source_id, {
            id: record.source_id,
            type: "default",
            position: { x: 0, y: 0 },
            data: {
              label:
                (record.source_props.name as string) ??
                record.source_label,

              labelType: record.source_label,

              properties: record.source_props,
            },
          });
        }

        if (!nodeMap.has(record.target_id)) {
          nodeMap.set(record.target_id, {
            id: record.target_id,
            type: "default",
            position: { x: 0, y: 0 },
            data: {
              label:
                (record.target_props.name as string) ??
                record.target_label,

              labelType: record.target_label,

              properties: record.target_props,
            },
          });
        }

        edgeList.push({
          id: `${record.source_id}-${record.target_id}`,
          source: record.source_id,
          target: record.target_id,
          label: record.relationship,
        });
      });

      nodeMap.forEach((node) => {
        g.setNode(node.id, {
          width: 180,
          height: 60,
        });
      });

      edgeList.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
      });

      dagre.layout(g);

      const layoutedNodes: Node[] = [...nodeMap.values()].map((node) => {
        const p = g.node(node.id);

        return {
          ...node,
          position: {
            x: p.x,
            y: p.y,
          },
        };
      });

      setNodes(layoutedNodes);
      setEdges(edgeList);
    }

    load();
  }, []);

  return (
    <div className="panel h-full">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => {
        console.log("Clicked:", node);

        setSelectedNode({
          id: node.id,
          label: node.data.labelType,
          properties: node.data.properties,
        });
      }}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
