import { useMemo, useState } from "react";
import { useGraph } from "../context/GraphContext";

export default function Sidebar() {
  const {
    objects,
    selectedNode,
    setSelectedNode,
    setSelectedNodeId,
  } = useGraph();

  const grouped = useMemo(() => {
    return objects.reduce<Record<string, typeof objects>>((acc, object) => {
      if (!acc[object.type]) {
        acc[object.type] = [];
      }

      acc[object.type].push(object);

      return acc;
    }, {});
  }, [objects]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  return (
    <aside className="border-r border-neutral-200 overflow-y-auto">

      <div className="p-5">

        <h2 className="text-lg font-bold mb-5">
          Objects
        </h2>

        {Object.entries(grouped).map(([type, items]) => {
          const open = openGroups[type] ?? false;

          return (
            <div key={type} className="mb-5">

              <button
                className="flex w-full items-center justify-between rounded px-2 py-2 text-left hover:bg-neutral-100"
                onClick={() =>
                  setOpenGroups((prev) => ({
                    ...prev,
                    [type]: !open,
                  }))
                }
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {type} ({items.length})
                </span>

                <span className="text-neutral-500">
                  {open ? "−" : "+"}
                </span>
              </button>

              {open && (
                <div className="mt-2 ml-2 space-y-1">
                  {items.map((object) => (
                    <button
                      key={object.id}
                      onClick={() => {
                        setSelectedNode(object);
                        setSelectedNodeId(object.id);
                      }}
                      className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                        selectedNode?.id === object.id
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-neutral-100"
                      }`}
                    >
                      {object.label}
                    </button>
                  ))}
                </div>
              )}

            </div>
          );
        })}

      </div>

    </aside>
  );
}
