"use client"

import React, { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send } from "lucide-react"

export default function Editor() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const docId = "doc1";  // In a real app, this should be dynamic

  useEffect(() => {
    // Create the socket connection inside the effect
    const socketIo = io("http://localhost:5001", {
      transports: ["websocket", "polling"]
    });
    setSocket(socketIo);

    socketIo.on("connect", () => {
      console.log("Connected:", socketIo.id);
      setConnected(true);
      socketIo.emit("join-document", docId);
    });

    socketIo.on("load-document", (documentContent: string) => {
      setContent(documentContent);
    });

    socketIo.on("update-document", (newContent: string) => {
      setContent(newContent);
    });

    socketIo.on("new-comment", (newComment: string) => {
      setComments((prev) => [...prev, newComment]);
    });

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
      setSocket(null);
    };
  }, [docId]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket?.emit("edit-document", { docId, content: newContent });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    socket?.emit("add-comment", { docId, comment });
    // Optionally update local state if you want to see your own comment immediately
    setComments((prev) => [...prev, comment]);
    setComment("");
  };

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Document Editor</span>
              <span className={`h-3 w-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing..."
              className="min-h-[400px] w-full resize-none"
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {comments.map((comm, index) => (
                <div key={index} className="mb-2 rounded-lg bg-muted p-2 text-sm">
                  {comm}
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send comment</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

