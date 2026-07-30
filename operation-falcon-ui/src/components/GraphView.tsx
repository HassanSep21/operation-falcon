import { useEffect, useState } from "react";
import { useGraph } from "../context/GraphContext";

import {
  ReactFlow,
  Background,
  Controls,
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

  const {
      setSelectedNode,
      setSelectedNodeId,
      highlightedNodes,
      setObjects,
      selectedNodeId,
  } = useGraph();

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

      const layoutedNodes = [...nodeMap.values()].map((node) => {
          const p = g.node(node.id);

          return {
              ...node,

              style: {
                border: "1px solid #999",
                background: "#fff",
                borderRadius: 8,
              },

              position: {
                  x: p.x,
                  y: p.y,
              },
          };
      });

      const objects = layoutedNodes.map((node) => ({
        id: node.id,
        label: node.data.label,
        type: node.data.labelType,
        properties: node.data.properties,
      }));

      setObjects(objects);
      
      setNodes(layoutedNodes);
      setEdges(edgeList);
    }

    load();
  }, []);

  useEffect(() => {
    setNodes((prev) =>
      prev.map((node) => {
        const isSelected = node.id === selectedNodeId;
        const isHighlighted = highlightedNodes.includes(node.id);

        return {
          ...node,
          style: {
            border: isSelected
              ? "3px solid #16a34a"
              : isHighlighted
              ? "3px solid #2563eb"
              : "1px solid #999",

            background: isSelected
              ? "#dcfce7"
              : isHighlighted
              ? "#dbeafe"
              : "#ffffff",

            borderRadius: 8,
          },
        };
      })
    );
  }, [highlightedNodes, selectedNodeId]);

  return (
    <div className="panel h-full">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => {
          setSelectedNode({
            id: node.id,
            label: node.data.labelType,
            properties: node.data.properties,
          });

          setSelectedNodeId(node.id);
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
