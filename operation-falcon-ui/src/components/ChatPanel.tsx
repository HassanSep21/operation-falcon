export default function ChatPanel() {
  return (
    <section className="flex flex-col p-6">

      <p className="section-title mb-6">
        AI Analyst
      </p>

      <div className="flex-1 border border-neutral-200 p-4">

        <p className="meta">
          Chat interface will be connected to /chat.
        </p>

      </div>

      <input
        className="mt-4 w-full border border-neutral-200 p-3 outline-none"
        placeholder="Ask about the knowledge graph..."
      />

    </section>
  );
}
