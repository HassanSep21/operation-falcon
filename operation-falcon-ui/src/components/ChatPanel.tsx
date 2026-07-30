import { useState } from "react";
import { useGraph } from "../context/GraphContext";
import axios from "axios";

interface ChatResponse {
  question: string;
  answer: {
    answer: string;
    cypher: string;
    highlighted_nodes: string[];
  };
}

export default function ChatPanel() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);

  const { setHighlightedNodes } = useGraph();

  async function ask() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          question,
        }
      );

      setResponse(res.data);
      setHighlightedNodes(
        res.data.answer.highlighted_nodes ?? []
      );
    } catch (err) {
      console.error(err);

      setResponse({
        question,
        answer: {
          answer: "Failed to contact backend.",
          cypher: "",
        },
      });
    }

    setLoading(false);
  }

  return (
    // Added w-full, min-w-0, and overflow-hidden to rigidly constrain the panel
    <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border-t border-neutral-200">

      <div className="border-b border-neutral-200 p-4 font-semibold">
        AI Analyst
      </div>

      <div className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4">
        {loading && (
          <div className="text-sm text-neutral-500">
            Thinking...
          </div>
        )}

        {response && !loading && (
          <div className="space-y-4">

            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">
                Question
              </p>

              <p className="mt-1 break-words">
                {response.question}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">
                Answer
              </p>

              <div
                className="
                  mt-1
                  whitespace-pre-wrap
                  break-words
                  break-all
                  overflow-hidden
                  max-w-full
                  text-sm
                "
              >
                {response.answer.answer}
              </div>
            </div>

            {response.answer.cypher && (
              <div className="w-full min-w-0">
                <p className="text-xs font-semibold uppercase text-neutral-400">
                  Cypher
                </p>
                {/* Added max-w-full to prevent the pre tag from stretching the layout */}
                <pre className="mt-2 max-w-full overflow-x-auto rounded bg-neutral-100 p-3 text-xs">
                  <code>{response.answer.cypher}</code>
                </pre>
              </div>
            )}

          </div>
        )}

      </div>

      <div className="border-t border-neutral-200 p-4">

        <div className="flex gap-2 w-full min-w-0">
          {/* Added min-w-0 to the input to prevent flex blowout here as well */}
          <input
            className="flex-1 min-w-0 rounded border border-neutral-300 px-3 py-2 outline-none focus:border-blue-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="Ask about the knowledge graph..."
          />

          <button
            onClick={ask}
            className="rounded bg-black px-4 text-white disabled:opacity-50 shrink-0"
            disabled={loading}
          >
            Send
          </button>

        </div>

      </div>

    </section>
  );
}
