import { Box, Button, TextField, Skeleton } from "@mui/material";
import type { UserPreview, Message } from "../../../../../types";
import {
  useGetMessagesWithUserQuery,
  useSendMessageMutation,
  authApi,
} from "../../../../../api/apiRoutes/userApi";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

interface MessagesWithUserProps {
  otherUser: UserPreview;
  userId: number;
}

// Create socket instance once outside component
const socket = io("http://localhost:8000", {
  withCredentials: true,
  auth: {
    userId: localStorage.getItem("userId") ?? "",
  },
});

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
  const bottomRef = useRef<HTMLDivElement>(null);

  // Use RTK Query data as source of truth, memoized for performance
  const messages = useMemo(() => messagesData ?? [], [messagesData]);

  // Scroll to bottom on message changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    console.log("✅ Socket connected:", socket.id);

    // Cast socket.auth to avoid TS error
    const auth = socket.auth as { userId?: string };
    console.log("🆔 Socket auth userId:", auth.userId);

    const handleNewMessage = (newMsg: Message) => {
      console.log("📨 Received new-message event:", newMsg);

      // Check if new message belongs to this chat
      const isRelevant =
        (newMsg.senderId === userId && newMsg.recipientId === otherUser.id) ||
        (newMsg.senderId === otherUser.id && newMsg.recipientId === userId);

      if (!isRelevant) {
        console.log("📨 Message not relevant, ignoring");
        return;
      }

      // Update RTK Query cache for this chat
      authApi.util.updateQueryData(
        "getMessagesWithUser",
        otherUser.id,
        (draft) => {
          if (!draft.find((msg) => msg.id === newMsg.id)) {
            draft.push(newMsg);
            console.log("🛠️ Added new message to cache");
          }
        }
      );
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      console.log("👋 Cleaning up socket listener");
      socket.off("new-message", handleNewMessage);
    };
  }, [userId, otherUser.id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const content = input.trim();

    try {
      // Send message via backend API
      await sendMessage({
        content,
        recipientId: otherUser.id,
      }).unwrap();

      // Emit socket event to notify others
      socket.emit("send-message", {
        senderId: userId,
        recipientId: otherUser.id,
        content,
      });

      setInput("");
    } catch {
      alert("❌ Error sending message. Please try again.");
    }
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
              color: "black", // Text color black for contrast
            }}
          >
            <strong>{msg.senderId === userId ? "You" : otherUser.name}:</strong>{" "}
            {msg.content}
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
