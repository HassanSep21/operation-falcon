import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import GraphView from "../components/GraphView";
import DetailsPanel from "../components/DetailsPanel";
import ChatPanel from "../components/ChatPanel";

export default function Dashboard() {
  return (
    <div className="flex h-screen flex-col bg-white">

      <Navbar />

      <div className="grid flex-1 grid-cols-[220px_1fr_360px] overflow-hidden">

        <Sidebar />

        <main className="min-w-0 overflow-hidden border-x border-neutral-200 p-6">
          <GraphView />
        </main>

        <div className="grid min-w-0 grid-rows-[1fr_380px]">

          <DetailsPanel />

          <ChatPanel />

        </div>

      </div>

    </div>
  );
}
