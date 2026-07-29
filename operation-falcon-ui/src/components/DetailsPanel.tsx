import { useGraph } from "../context/GraphContext";

export default function DetailsPanel() {
  const { selectedNode } = useGraph();

  return (
    <div className="panel p-5 h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">
        Inspector
      </h2>

      {!selectedNode ? (
        <div className="text-gray-400">
          Select a node from the graph.
        </div>
      ) : (
        <>
          <div className="mb-5">
            <div className="text-xs uppercase text-gray-400">
              Type
            </div>

            <div className="text-xl font-semibold">
              {selectedNode.label}
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(selectedNode.properties).map(([key, value]) => (
              <div
                key={key}
                className="border-b border-gray-700 pb-2"
              >
                <div className="text-xs uppercase text-gray-500">
                  {key.replace(/_/g, " ")}
                </div>

                <div className="text-sm">
                  {String(value)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
