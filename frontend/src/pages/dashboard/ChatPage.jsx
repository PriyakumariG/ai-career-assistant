import { useState, useRef, useEffect } from "react";
import ResumeUpload from "../../components/ResumeUpload";
import ResumeSelector from "../../components/ResumeSelector";
import { chatWithResume } from "../../api/resumes";
import { useResume } from "../../context/ResumeContext";
import { Send, Loader2, Bot, User } from "lucide-react";

export default function ChatPage() {
  const { activeResume: resume, setActiveResume: setResume } = useResume();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUploadSuccess = (resumeData) => {
    setResume(resumeData);
    setMessages([]);
    setError("");
  };

  const handleSend = async () => {
    const question = input.trim();
    if (!question || !resume) return;

    const userMessage = { role: "user", content: question };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await chatWithResume(resume.id, question, history);
      setMessages([...newMessages, { role: "assistant", content: response.data.answer }]);
    } catch (err) {
      setError(err.response?.data?.detail || "Chat failed. Please try again.");
      setMessages(messages);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">
          Chat With Your Resume
        </h2>
        <p className="text-text-muted">
          Ask questions about your resume and get answers grounded in your
          actual experience.
        </p>
      </div>

      {!resume ? (
        <div className="space-y-3">
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
          <ResumeSelector onSelect={handleUploadSuccess} />
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-text text-sm font-medium">{resume.file_name}</p>
            <button
              onClick={() => {
                setResume(null);
                setMessages([]);
              }}
              className="text-text-muted hover:text-text text-sm transition"
            >
              Change file
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-start gap-2.5">
                <div className="bg-accent-muted rounded-full p-1.5 flex-shrink-0">
                  <Bot className="text-accent" size={16} />
                </div>
                <p className="text-text-muted text-sm bg-surface-hover rounded-lg px-3 py-2 max-w-[80%]">
                  Hi! I've read your resume. Ask me anything — like what
                  projects to highlight, or whether you're a good fit for a
                  specific role.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`rounded-full p-1.5 flex-shrink-0 ${
                    msg.role === "user" ? "bg-surface-hover" : "bg-accent-muted"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="text-text-muted" size={16} />
                  ) : (
                    <Bot className="text-accent" size={16} />
                  )}
                </div>
                <p
                  className={`text-sm rounded-lg px-3 py-2 max-w-[80%] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-base"
                      : "text-text-muted bg-surface-hover"
                  }`}
                >
                  {msg.content}
                </p>
              </div>
            ))}

            {isSending && (
              <div className="flex items-start gap-2.5">
                <div className="bg-accent-muted rounded-full p-1.5 flex-shrink-0">
                  <Bot className="text-accent" size={16} />
                </div>
                <div className="bg-surface-hover rounded-lg px-3 py-2">
                  <Loader2 className="animate-spin text-text-muted" size={16} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <p className="text-danger text-sm bg-danger/10 border-t border-danger/30 px-4 py-2">
              {error}
            </p>
          )}

          <div className="border-t border-border p-3 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask something about your resume..."
              className="flex-1 bg-base border border-border rounded-lg px-3 py-2 text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition resize-none"
            />
            <button
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-base p-2.5 rounded-lg transition flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}