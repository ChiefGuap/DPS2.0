"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Bold,
  Italic,
  List,
  Heading2,
  TableIcon,
  Code,
  Quote,
  MessageCircle,
  Send,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

// Basic MenuBar using execCommand for formatting
const MenuBar = ({
  onBold,
  onItalic,
  onHeading,
  onBulletList,
  onOrderedList,
  onCode,
  onBlockquote,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onUndo,
  onRedo,
}: {
  onBold: () => void;
  onItalic: () => void;
  onHeading: () => void;
  onBulletList: () => void;
  onOrderedList: () => void;
  onCode: () => void;
  onBlockquote: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onUndo: () => void;
  onRedo: () => void;
}) => {
  return (
    <div className="border-b p-2 flex flex-wrap gap-1">
      <Button variant="ghost" size="sm" onClick={onBold}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onItalic}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onHeading}>
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onBulletList}>
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onOrderedList}>
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onCode}>
        <Code className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onBlockquote}>
        <Quote className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onAlignLeft}>
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onAlignCenter}>
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onAlignRight}>
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onUndo}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onRedo}>
        <Redo className="h-4 w-4" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <TableIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Insert Table</div>
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => {
                const rows = Math.floor(i / 5) + 1;
                const cols = (i % 5) + 1;
                return (
                  <div
                    key={i}
                    className="w-6 h-6 border rounded hover:bg-primary/20 cursor-pointer"
                    onClick={() => {
                      alert(`Insert table ${rows}x${cols} - not implemented`);
                    }}
                  />
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Select table dimensions
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default function Editor() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [docId] = useState("default");
  const [connected, setConnected] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const isRemoteUpdateRef = useRef(false);

  // Logout handler
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      router.push("/login");
    }
  };

  // Formatting functions using document.execCommand
  const handleBold = () => document.execCommand("bold", false);
  const handleItalic = () => document.execCommand("italic", false);
  const handleHeading = () => document.execCommand("formatBlock", false, "H2");
  const handleBulletList = () => document.execCommand("insertUnorderedList", false);
  const handleOrderedList = () => document.execCommand("insertOrderedList", false);
  const handleCode = () => document.execCommand("formatBlock", false, "PRE");
  const handleBlockquote = () => document.execCommand("formatBlock", false, "BLOCKQUOTE");
  const handleAlignLeft = () => document.execCommand("justifyLeft", false);
  const handleAlignCenter = () => document.execCommand("justifyCenter", false);
  const handleAlignRight = () => document.execCommand("justifyRight", false);
  const handleUndo = () => document.execCommand("undo", false);
  const handleRedo = () => document.execCommand("redo", false);

  // onInput handler for the contentEditable div
  const handleInput = () => {
    if (isRemoteUpdateRef.current) return;
    const content = editorRef.current?.innerHTML || "";
    socketRef.current?.emit("edit-document", { docId, content });
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("save-document", { docId, content });
    }, 1000);
  };

  // Check auth status
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        router.push("/login");
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (!session) {
          router.push("/login");
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  // Set up socket connection and listeners
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5001";
    console.log("Connecting socket to:", baseUrl);

    const socketIo = io(baseUrl, { transports: ["websocket"] });
    setSocket(socketIo);
    socketRef.current = socketIo;

    socketIo.on("connect", () => {
      console.log("Connected:", socketIo.id);
      setConnected(true);
      socketIo.emit("join-document", docId);
    });

    socketIo.on("load-document", async (documentContent: string) => {
      let { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", docId)
        .maybeSingle();

      if (!data) {
        // No document found—create one with default content and team_id
        const { data: newData, error: insertError } = await supabase
          .from("documents")
          .insert([{ 
            id: docId, 
            content: "", 
            team_id: 1  // team_id added
          }])
          .maybeSingle();
        if (insertError) {
          console.error("Error inserting default document:", insertError);
          return;
        }
        data = newData;
      }

      // Emit the document content to the socket (fallback if undefined)
      socketIo.emit("load-document", (data && data.content) || "");

      isRemoteUpdateRef.current = true;
      if (editorRef.current) {
        editorRef.current.innerHTML = documentContent;
      }
      setTimeout(() => {
        isRemoteUpdateRef.current = false;
      }, 100);
    });

    socketIo.on("update-document", (newContent: string) => {
      if (editorRef.current && editorRef.current.innerHTML !== newContent) {
        isRemoteUpdateRef.current = true;
        editorRef.current.innerHTML = newContent;
        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 100);
      }
    });

    socketIo.on("new-comment", (newComment: string) => {
      setComments((prev) => [...prev, newComment]);
    });

    return () => {
      socketIo.disconnect();
      setSocket(null);
      socketRef.current = null;
    };
  }, [docId]);

  // Handle comment form submission, saving comment to database
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // Emit comment via socket
    socket?.emit("add-comment", { docId, comment });
    setComments((prev) => [...prev, comment]);
    
    // Save comment to Supabase "comments" table
    const { error } = await supabase
      .from("comments")
      .insert([{ doc_id: docId, comment }]);
    if (error) {
      console.error("Error saving comment:", error.message);
    }
    
    setComment("");
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        <Card className="border shadow-lg">
          <CardHeader className="border-b pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <span>Document Editor</span>
                <span
                  className={`h-3 w-3 rounded-full ${
                    connected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </CardTitle>
          </CardHeader>
          <MenuBar
            onBold={handleBold}
            onItalic={handleItalic}
            onHeading={handleHeading}
            onBulletList={handleBulletList}
            onOrderedList={handleOrderedList}
            onCode={handleCode}
            onBlockquote={handleBlockquote}
            onAlignLeft={handleAlignLeft}
            onAlignCenter={handleAlignCenter}
            onAlignRight={handleAlignRight}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
          <CardContent className="p-0">
            <div
              className="min-h-[500px] p-4 cursor-text border"
              contentEditable
              ref={editorRef}
              onInput={handleInput}
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
              <TextareaAutosize
                minRows={3}
                maxRows={10}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border border-gray-300 rounded"
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