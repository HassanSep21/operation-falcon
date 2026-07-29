const items = [
  "Aircraft",
  "Pilots",
  "Missions",
  "Airbases",
  "Radar",
  "Squadrons",
];

export default function Sidebar() {
  return (
    <aside className="border-r border-neutral-200">

      <nav className="p-6">

        <p className="section-title mb-8">
          Objects
        </p>

        <ul className="space-y-4">

          {items.map((item) => (

            <li
              key={item}
              className="cursor-pointer border border-transparent px-3 py-2 transition hover:border-neutral-300"
            >
              {item}
            </li>

          ))}

        </ul>

      </nav>

    </aside>
  );
}
