"use client";

import { useEffect, useState } from "react";
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
import { newContributions, savedContributions } from "@/store/reducers/contributionSlice";
import { Stethoscope } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import Editor from 'react-simple-code-editor'
import { useToast } from "@/hooks/use-toast";
import { Program } from "@/types";


interface FeedbackFormProps {
  type: "bug" | "suggestion";
  programId: string;
  open: boolean;
  selectedProgram: Program
  onOpenChange: (open: boolean) => void;
}

const FeedbackDialog = ({ type, programId, open, onOpenChange, selectedProgram }: FeedbackFormProps) => {
  const { isAuthenticated, user } = useAuth();
  const [javacode, setJavacode] = useState("");
  const [pythoncode, setPythoncode] = useState("");
  const [htmlcode, setHtmlcode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const savedContributionItems = useAppSelector(state => state.contributions.savedContributions);
  // Add this useEffect to handle unauthorized users
  useEffect(() => {
    if (open && !isAuthenticated) {
      onOpenChange(false); // Close the dialog
      router.push('/auth'); // Redirect to auth page
    }
    if (isAuthenticated && user?.id) {
      dispatch(savedContributions(user.id));
    }
  }, [open, isAuthenticated, router, onOpenChange]);
  const formatCode = (code: string) => {
    const formattedCode = code.replaceAll('    ', '  ');
    return formattedCode;
  }
  useEffect(() => {
    const saved = savedContributionItems.filter(item => {
      if (item.programId === programId && item.type === type) return item;
    });
    setDescription(saved && saved[0] ? saved[0].description : "");
    setJavacode(saved && saved[0] ? saved[0].code.java : selectedProgram.code.java);
    setPythoncode(saved && saved[0] ? saved[0].code.python : selectedProgram.code.python);
    setHtmlcode(saved && saved[0] ? saved[0].code.html : selectedProgram.code.html);
  }, [open]);
  const [submitType, setSubmitType] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(submitType);
    setLoading(true);
    setError("");
    dispatch(newContributions({
      useremail: user?.email,
      type,
      programId,
      status: submitType == 'save' ? 'saved' : 'pending',
      code: { javacode, pythoncode, htmlcode },
      description,
    })).then(() => {
      onOpenChange(false);
      toast({
        title: "Contribution Submitted",
        description: "Your contribution has been successfully submitted for review.",
        variant: "default",
        duration: 5000,
      });
    }).catch(error => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your contribution.",
        variant: "destructive",
        duration: 5000,
      });
    });
    setLoading(false);
  }
  const highlightCode = (code: string, language: string) => (
    <Highlight
      theme={themes.oneLight}
      code={formatCode(code)}
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
      <DialogContent className="dialog-size p-0 m-0">
        <Card className="h-full flex flex-col border-none shadow-none overflow-hidden">
          <CardHeader>
            <CardTitle>
              {type === "bug" ? "Report a Bug" : "Suggest Improvement"}
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} className="space-y-4 h-full">
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
                      outline: 'none',
                    }}
                    placeholder="Enter HTML code here..."
                    className="outline-none focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div className="flex space-x-4 pb-4">
                <Button type="submit" className="w-full mt-2 bg-[#0284DA] hover:bg-[#0284FF]"
                  size="sm"
                  disabled={loading}
                  name="submitType"
                  value="save"
                  onClick={() => { setSubmitType('save') }}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button type="submit"
                  className="w-full mt-2 bg-[#0284DA] hover:bg-[#0284FF]"
                  size="sm" disabled={loading}
                  name="submitType"
                  value="publish"
                  onClick={() => { setSubmitType('submit') }}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
export default FeedbackDialog;