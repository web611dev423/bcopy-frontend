"use client";

import { Copy, Share, Flag, ExternalLink, Lightbulb } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef } from "react";
import { HELLO_DEVELOPER } from "@/constants";
interface CodeCardProps {
  code: string;
  language: string;
  title: string;
  isDashboard: boolean;
  clickFunc: (lang: string) => void;
  showDialog: (open: boolean) => void;
}

const CodeCard = ({ code, language, title, showDialog, clickFunc, isDashboard }: CodeCardProps) => {
  const [mouseDownPosition, setMouseDownPosition] = useState<{ x: number; y: number } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDownPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseDownPosition) {
      const deltaX = Math.abs(e.clientX - mouseDownPosition.x);
      const deltaY = Math.abs(e.clientY - mouseDownPosition.y);

      // If the mouse hasn't moved more than 0 pixels, consider it a click
      if (deltaX < 1 && deltaY < 1) {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          clickFunc(language);
          showDialog(true);
        }
      }
      setMouseDownPosition(null);
    }
  };

  return (
    <Card className={`h-full hover:cursor-pointer shadow-lg lounded-lg ${isDashboard ? "bg-[#1f1f2b]" : "bg-white"}`}>
      <CardHeader className="p-4 border-b border-[#c8c8c8] flex justify-between items-center">
        <CardTitle className={`${isDashboard ? "text-white" : "text-gray-500"} text-base text-md sm:text-2xl`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea
          ref={scrollAreaRef}
          className={`h-[200px] sm:h-[250px] lg:h-[300px] w-full p-4 ${isDashboard ? "text-lg sm:text-2xl" : "text-sm sm:text-md"}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}>
          <Highlight theme={isDashboard == true ? themes.vsDark : themes.vsLight} code={code} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} style={{ ...style, background: 'transparent' }}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {isDashboard ? null : <span className="text-gray-500 mr-4">{i + 1}</span>}
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </ScrollArea>
      </CardContent>
      <CardFooter className={`${isDashboard ? "bg-[#202938]" : "bg-white"} p-2 sm:p-4 border-t border-[#c8c8c8] flex justify-center space-x-2 sm:space-x-6 items-center rounded-lg`}>
        <button className="text-gray-400 hover:text-gray-600 transition-colors"><Copy className="h-4 w-4 sm:h-5 sm:w-5" /></button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors"><Share className="h-4 w-4 sm:h-5 sm:w-5" /></button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors"><Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" /></button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors"><Flag className="h-4 w-4 sm:h-5 sm:w-5" /></button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors"><ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" /></button>
      </CardFooter>
    </Card>
  )
}

export default CodeCard;