"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth"; // You'll need to create this hook
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { newContributions } from "@/store/reducers/contributionSlice";
import { Stethoscope } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import Editor from 'react-simple-code-editor'

interface FeedbackFormProps {
  type: "bug" | "suggestion";
  programId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeedbackDialog = ({ type, programId, open, onOpenChange }: FeedbackFormProps) => {
  const { isAuthenticated, user } = useAuth();
  const [javacode, setJavacode] = useState("");
  const [pythoncode, setPythoncode] = useState("");
  const [htmlcode, setHtmlcode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Add this useEffect to handle unauthorized users
  useEffect(() => {
    if (open && !isAuthenticated) {
      onOpenChange(false); // Close the dialog
      router.push('/auth'); // Redirect to auth page
    }
  }, [open, isAuthenticated, router, onOpenChange]);
  useEffect(() => {
    setDescription("");
    setJavacode("");
    setPythoncode("");
    setHtmlcode("");
  }, [open]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    dispatch(newContributions({
      useremail: user?.email,
      type,
      programId,
      code: { javacode, pythoncode, htmlcode },
      description,
    })).then(() => {
      onOpenChange(false);
    });
    setLoading(false);
  }
  const highlightCode = (code: string, language: string) => (
    <Highlight
      theme={themes.vsDark}
      code={code}
      language={language}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </>
      )}
    </Highlight>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <Card className="bordenr-none">
          <CardHeader>
            <CardTitle>
              {type === "bug" ? "Report a Bug" : "Suggest Improvement"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    type === "bug"
                      ? "Describe the bug..."
                      : "Describe your suggestion..."
                  }
                  rows={2}
                  maxLength={5000}
                  required
                  className="outline-none focus-visible:ring-offset-0 focus-visible:ring-0 max-h-[100px] overflow-auto resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Java Code</label>
                <div className="rounded-md border bg-muted">
                  <Editor
                    value={javacode}
                    onValueChange={code => setJavacode(code)}
                    highlight={code => highlightCode(code, 'c')}
                    padding={15}
                    maxLength={5000}
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      minHeight: '100px',
                      outline: 'none',
                      resize: 'none',
                      overflow: 'auto',
                      maxHeight: '100px',
                    }}
                    placeholder="Enter Java code here..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Python Code</label>
                <div className="rounded-md border bg-muted">
                  <Editor
                    value={pythoncode}
                    onValueChange={code => setPythoncode(code)}
                    highlight={code => highlightCode(code, 'python')}
                    padding={15}
                    maxLength={5000}
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      minHeight: '100px',
                      outline: 'none',
                      resize: 'none',
                      overflow: 'auto',
                      maxHeight: '100px',
                    }}
                    placeholder="Enter Python code here..."
                    className="outline-none focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">HTML Code</label>
                <div className="rounded-md border bg-muted">
                  <Editor
                    value={htmlcode}
                    onValueChange={code => setHtmlcode(code)}
                    highlight={code => highlightCode(code, 'html')}
                    padding={15}
                    maxLength={5000}
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      minHeight: '100px',
                      maxHeight: '100px'
                    }}
                    placeholder="Enter HTML code here..."
                    className="outline-none focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <Button type="submit" className="w-full mt-2 bg-[#0284DA] hover:bg-[#0284FF]" size="sm" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
export default FeedbackDialog;