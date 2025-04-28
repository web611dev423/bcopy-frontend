"use client";

import { Copy, Flag, ExternalLink, Lightbulb, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";

import * as shiki from "shiki";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface CodeCardProps {
  code: string;
  language: string;
  title: string;
  isDashboard: boolean;
  clickFunc: (lang: string) => void;
  copyCode: () => void;
  showDialog: (open: boolean) => void;
  copiedNumber: number;
  viewedNumber: number;
  sharedNumber: number;
  onShowFeedback: (type: "bug" | "suggestion") => void;
}

const CodeCard = ({ code, language, title, showDialog, clickFunc, isDashboard, copyCode, onShowFeedback, copiedNumber, viewedNumber, sharedNumber }: CodeCardProps) => {
  const [mouseDownPosition, setMouseDownPosition] = useState<{ x: number; y: number } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDownPosition({ x: e.clientX, y: e.clientY });
  };
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');
  const onShowCode = () => {
    clickFunc(language);
    showDialog(true);
  }
  const formatCode = (code: string) => {
    const formattedCode = code.replaceAll('    ', '  ');
    return formattedCode;
  }
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    await copyCode();
  }
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDashboard) {
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
    }
  };
  useEffect(() => {
    const highlight = async () => {
      const highlighter = await shiki.createHighlighter({
        themes: ['light-plus', 'monokai'],
        langs: ['javascript', 'python', 'java', 'html']
      });

      const highlighted = highlighter.codeToHtml(formatCode(code), {
        lang: language,
        theme: isDashboard ? 'monokai' : 'light-plus',
      });
      setHighlightedCode(highlighted);
    };

    highlight();
  }, [code, language, isDashboard]);
  return (
    <Card className={`h-full hover:cursor-pointer shadow-lg lounded-lg ${isDashboard ? "bg-[#1f1f2b]" : "bg-white"}`}>
      <CardHeader className="ps-2 pe-2 pt-0 pb-2 border-b border-[#c8c8c8] grid grid-cols-12 w-full">
        <div className="col-span-3 pt-2 justify-start w-full items-top">
          <span className={`${isDashboard ? "text-white" : "text-gray-500"}`}>{language.toString().slice(0, 1).toUpperCase() + language.toString().slice(1)}</span>
        </div>
        <div className="col-span-6 w-full pt-4 justify-center flex flex-wrap">
          <CardTitle className={`${isDashboard ? "text-white" : "text-gray-500"} text-lg md:text-1xl lg:text-2xl whitespace-nowrap overflow-hidden text-ellipsis`}>{title}</CardTitle>
        </div>
        <div className="col-span-3 flex flex-inline pt-2 justify-end w-full">
          <div className="flex space-x-2">
            <button className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <button className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <button className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 font-display">
        <ScrollArea
          ref={scrollAreaRef}
          className={"h-[200px] sm:h-[250px] lg:h-[300px] w-full p-4 text-sm md:text-md"}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}>
          <div
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className="shiki"
            style={{ backgroundColor: 'transparent' }}
          />
        </ScrollArea>
      </CardContent>
      <CardFooter className={`${isDashboard ? "bg-[#202938]" : "bg-white"} min-h-[50px] p-2 sm:p-4 border-t border-[#c8c8c8] relative flex items-center rounded-lg `}>
        {!isDashboard && (
          <div className="grid grid-cols-3 text-gray-800 text-md gap-1">
            <div className="col-span-1 w-fit-content flex items-center" >
              <Eye className="w-4 h-4" />{viewedNumber}
            </div>
            <div className="col-span-1 w-fit-content flex items-center">
              <Copy className="w-4 h-4" />{copiedNumber}
            </div>
            <div className="col-span-1 w-fit-content flex items-center">
              <ExternalLink className="w-4 h-4" />{sharedNumber}
            </div>
          </div>
        )}

        {/* Centered group of buttons */}
        <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className={`hover:text-gray-600 transition-colors ${copied ? "text-gray-600" : "text-gray-400"}`} onClick={handleCopyCode}>
                  <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={() => isDashboard ? null : onShowCode()}>
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={() => isDashboard ? null : onShowFeedback("bug")}>
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bug</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={() => isDashboard ? null : onShowFeedback("suggestion")}>
                  <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Suggestion</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>

    </Card >
  )
}

export default CodeCard;