// Komponen komentar/log real-time
"use client";
import { useEffect, useState, useRef } from "react";

export default function KomentarRealtime() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3001");
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "init") setComments(msg.comments || []);
      if (msg.type === "new" && msg.comment) {
        setComments((prev) => [...prev, msg.comment]);
      }
      if (msg.type === "clear") {
        setComments([]);
      }
    };
    return () => ws.current && ws.current.close();
  }, []);

  const sendComment = () => {
    if (input.trim()) {
      ws.current.send(JSON.stringify({ type: "comment", text: input }));
      setInput("");
    }
  };

  const handleDeleteLog = (index) => {
    setComments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteAllLog = async () => {
    await fetch("http://localhost:3001/logs", { method: "DELETE" });
    setComments([]);
  };

  return (
    <div style={{ marginTop: 32 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <h3>Komentar/Log Real-Time</h3>
        <button
          style={{
            padding: "4px 12px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={handleDeleteAllLog}
          title="Hapus semua log"
        >
          Hapus Semua Log
        </button>
      </div>
      <div
        style={{
          maxHeight: 200,
          overflowY: "auto",
          border: "1px solid #eee",
          padding: 8,
          marginBottom: 8,
        }}
      >
        {comments.map((c, i) => (
          <div
            key={i}
            style={{
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>{c.text}</span>
            <span
              style={{
                color: "#888",
                fontSize: 12,
                marginLeft: 8,
              }}
            >
              {new Date(c.time).toLocaleTimeString()}
            </span>
            <button
              style={{
                marginLeft: 12,
                color: "red",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
              onClick={() => handleDeleteLog(i)}
              title="Hapus log"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Tulis komentar..."
        style={{ width: "70%", padding: 6 }}
      />
      <button
        onClick={sendComment}
        style={{ padding: "6px 12px", marginLeft: 8 }}
      >
        Kirim
      </button>
    </div>
  );
}
