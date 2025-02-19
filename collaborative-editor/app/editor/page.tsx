"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "sonner";
import TextareaAutosize from "react-textarea-autosize";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  TableIcon,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Editor() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [docId] = useState("default");
  const [connected, setConnected] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const isRemoteUpdateRef = useRef(false);
  const [loading, setLoading] = useState(true);

  // Text editor state and ref
  const editorRef = useRef<HTMLDivElement>(null);
  const [tableSize, setTableSize] = useState({ rows: 2, cols: 2 });
  const [heading, setHeading] = useState("p");

  // Check authentication
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        localStorage.setItem("redirectPath", "/editor");
        router.push("/login");
        return;
      }
      const email = session.user.email;
      if (!email?.endsWith("@ucdavis.edu")) {
        await supabase.auth.signOut();
        toast.error("Use UC Davis email");
        localStorage.setItem("redirectPath", "/editor");
        router.push("/login");
        return;
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      if (!session) router.push("/login");
    });
    return () => authListener?.subscription?.unsubscribe();
  }, [router]);

  // Setup socket connection
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5001";
    const socketIo = io(baseUrl, { transports: ["websocket"] });
    setSocket(socketIo);
    socketRef.current = socketIo;

    socketIo.on("connect", () => {
      setConnected(true);
      socketIo.emit("join-document", docId);
    });

    socketIo.on("disconnect", () => {
      setConnected(false);
    });

    socketIo.on("load-document", async (serverContent: string) => {
      const { data, error } = await supabase
        .from("documents")
        .upsert({ id: docId, content: "", team_id: 1 })
        .select("*")
        .single();
      if (error) {
        console.error("Error upserting document:", error);
        return;
      }
      const contentToLoad = data?.content || "";
      socketIo.emit("load-document", contentToLoad);
      isRemoteUpdateRef.current = true;
      if (editorRef.current) {
        editorRef.current.innerHTML = serverContent || contentToLoad;
      }
      setTimeout(() => (isRemoteUpdateRef.current = false), 100);
    });

    socketIo.on("update-document", (newContent: string) => {
      if (editorRef.current && editorRef.current.innerHTML !== newContent) {
        isRemoteUpdateRef.current = true;
        editorRef.current.innerHTML = newContent;
        setTimeout(() => (isRemoteUpdateRef.current = false), 100);
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

  // Comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    socket?.emit("add-comment", { docId, comment });
    setComments((prev) => [...prev, comment]);
    const { error } = await supabase.from("comments").insert([{ doc_id: docId, comment }]);
    if (error) console.error("Error:", error.message);
    setComment("");
  };

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Editor functions
  const formatText = (command: string, value = "") => {
    if (command === "formatBlock") {
      if (value === "p") {
        document.execCommand("formatBlock", false, "<p>");
      } else if (value.startsWith("h")) {
        document.execCommand("formatBlock", false, `<${value}>`);
      } else {
        document.execCommand(command, false, value);
      }
    } else {
      document.execCommand(command, false, value);
    }
    editorRef.current?.focus();
  };

  const createTable = (rows: number, cols: number) => {
    const table = document.createElement("table");
    table.className = "border-collapse border w-full my-4";
    for (let i = 0; i < rows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < cols; j++) {
        const cell = row.insertCell();
        cell.className = "border p-2";
        cell.contentEditable = "true";
        cell.innerHTML = `Cell ${j + 1}`;
      }
    }
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(table);
    }
  };

  const handleInput = () => {
    if (isRemoteUpdateRef.current) return;
    const content = editorRef.current?.innerHTML || "";
    socketRef.current?.emit("edit-document", { docId, content });
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      socketRef.current?.emit("save-document", { docId, content });
    }, 1000);
  };

  const handleHeadingChange = (value: string) => {
    setHeading(value);
    formatText("removeFormat");
    formatText("formatBlock", value);
  };

  if (loading || !session) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {/* Header with indicator dot */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Document Editor</h2>
          <span
            className={`h-3 w-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
          />
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Text Editor */}
        <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
          <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg items-center">
            <Select onValueChange={handleHeadingChange}>
              <SelectTrigger className="w-[180px] h-9 bg-background relative z-50">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <SelectValue placeholder="Text style" />
                </div>
              </SelectTrigger>
              <SelectContent position="popper" className="w-[180px] z-50">
                <SelectItem value="p" className="flex items-center gap-2">
                  <span className="text-base font-normal">Normal</span>
                </SelectItem>
                <SelectItem value="h1" className="flex items-center gap-2">
                  <span className="text-2xl font-bold">Heading 1</span>
                </SelectItem>
                <SelectItem value="h2" className="flex items-center gap-2">
                  <span className="text-xl font-bold">Heading 2</span>
                </SelectItem>
                <SelectItem value="h3" className="flex items-center gap-2">
                  <span className="text-lg font-bold">Heading 3</span>
                </SelectItem>
                <SelectItem value="h4" className="flex items-center gap-2">
                  <span className="text-base font-bold">Heading 4</span>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => formatText("bold")}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => formatText("italic")}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => formatText("underline")}>
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => formatText("insertUnorderedList")}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => formatText("insertOrderedList")}>
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => formatText("justifyLeft")}>
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => formatText("justifyCenter")}>
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => formatText("justifyRight")}>
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <div className="grid grid-cols-5 gap-2">
                  {[
                    "red",
                    "orange",
                    "yellow",
                    "green",
                    "blue",
                    "purple",
                    "pink",
                    "gray",
                    "black",
                    "white",
                  ].map((color) => (
                    <Button
                      key={color}
                      variant="ghost"
                      className="w-6 h-6 p-0"
                      style={{ backgroundColor: color }}
                      onClick={() => formatText("foreColor", color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <TableIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Rows: {tableSize.rows}</span>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={tableSize.rows}
                      onChange={(e) =>
                        setTableSize((prev) => ({ ...prev, rows: Number.parseInt(e.target.value) }))
                      }
                      className="w-20"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Columns: {tableSize.cols}</span>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={tableSize.cols}
                      onChange={(e) =>
                        setTableSize((prev) => ({ ...prev, cols: Number.parseInt(e.target.value) }))
                      }
                      className="w-20"
                    />
                  </div>
                  <Button onClick={() => createTable(tableSize.rows, tableSize.cols)}>
                    Insert Table
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div
            ref={editorRef}
            className="min-h-[300px] w-full border rounded-lg p-4 focus:outline-none prose prose-sm max-w-none"
            contentEditable
            onInput={handleInput}
          />
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {comments.map((comm, idx) => (
                  <div key={idx} className="mb-2 rounded-lg bg-muted p-2 text-sm">
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
                  <span>Send</span>
                  <span className="sr-only">Send comment</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
