"use client";

import { useState } from "react";
import { Copy, Share, Flag, Lightbulb } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";

const CodeDialog = (props: any) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="p-0 m-0 max-w-fit">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <Card className="bg-white border-[#c8c8c8] w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] max-w-[1200px]">
          <CardHeader className="p-4 border-b border-[#c8c8c8] flex justify-between items-center">
            <CardTitle className="text-lg md:text-1xl lg:text-2xl whitespace-nowrap overflow-hidden text-ellipsis">{props.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[40vh] sm:h-[50vh] lg:h-[60vh] w-full text-md sm:text-lg">
              <Highlight theme={themes.oneLight} code={props.code} language={props.language == "java" ? "c" : props.language}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={className} style={{ ...style, background: 'transparent' }}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        <span className="text-gray-500 mr-4">{i + 1}</span>
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
          <CardFooter className="bg-white p-2 sm:p-4 border-t border-[#c8c8c8] flex justify-center space-x-2 sm:space-x-6 items-center rounded-lg">
            <button className="text-gray-600 hover:text-gray-800 outline-none"><Copy className="h-4 w-4 sm:h-5 sm:w-5" /></button>
            <button className="text-gray-600 hover:text-gray-800 outline-none"><Share className="h-4 w-4 sm:h-5 sm:w-5" /></button>
            <button className="text-gray-600 hover:text-gray-800 outline-none"><Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" /></button>
            <button className="text-gray-600 hover:text-gray-800 outline-none"><Flag className="h-4 w-4 sm:h-5 sm:w-5" /></button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default CodeDialog;