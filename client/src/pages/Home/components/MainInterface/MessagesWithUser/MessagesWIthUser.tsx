import { Box, Button, TextField, Skeleton } from "@mui/material";
import type { UserPreview, Message } from "../../../../../types";
import {
  useGetMessagesWithUserQuery,
  useSendMessageMutation,
} from "../../../../../api/apiRoutes/userApi";
import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface MessagesWithUserProps {
  otherUser: UserPreview;
  userId: number;
}

let socket: Socket | null = null;

export const MessagesWithUser = ({
  otherUser,
  userId,
}: MessagesWithUserProps) => {
  const {
    data: messagesData,
    isLoading,
    isError,
    error,
  } = useGetMessagesWithUserQuery(otherUser.id);

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [input, setInput] = useState("");
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(
    () => [...(messagesData ?? []), ...liveMessages],
    [messagesData, liveMessages]
  );

  useEffect(() => {
    if (!userId || socket) return;

    socket = io("http://localhost:8000", {
      withCredentials: true,
      auth: { userId },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket!.id);
    });

    socket.on("new-message", (newMsg: Message) => {
      const isRelevant =
        (newMsg.senderId === userId && newMsg.recipientId === otherUser.id) ||
        (newMsg.senderId === otherUser.id && newMsg.recipientId === userId);

      if (isRelevant) {
        setLiveMessages((prev) => {
          const exists = prev.some((msg) => msg.id === newMsg.id);
          return exists ? prev : [...prev, newMsg];
        });
      }
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [userId, otherUser.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const content = input.trim();

    try {
      await sendMessage({
        content,
        recipientId: otherUser.id,
      }).unwrap();

      setInput("");
    } catch {
      alert("❌ Error sending message. Please try again.");
    }

    socket?.emit("send-message", {
      senderId: userId,
      recipientId: otherUser.id,
      content,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={40}
            sx={{ mb: 1, borderRadius: 1 }}
            animation="wave"
          />
        ))}
      </Box>
    );
  }

  if (isError) {
    return <div>Error loading messages: {JSON.stringify(error)}</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: "2rem 3rem 1rem 3rem",
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        {messages.length === 0 && <div>No messages yet. Say hi!</div>}
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              mb: 1,
              p: 1,
              bgcolor: msg.senderId === userId ? "primary.light" : "grey.300",
              borderRadius: 1,
              alignSelf: msg.senderId === userId ? "flex-end" : "flex-start",
              maxWidth: "70%",
              wordBreak: "break-word",
              color: "black",
            }}
          >
            <strong>{msg.senderId === userId ? "You" : otherUser.name}:</strong>{" "}
            {msg.content}
            <Box sx={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Box>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <TextField
          fullWidth
          placeholder={`Message ${otherUser.name}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSending}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          multiline
          minRows={1}
          maxRows={4}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isSending || !input.trim()}
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </Box>
    </Box>
  );
};
