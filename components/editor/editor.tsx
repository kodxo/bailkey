"use client";

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  EditorBubble,
} from "novel";
import { handleCommandNavigation } from "novel";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { suggestionItems } from "./slash-command";
import { handleImageDrop, handleImagePaste } from "novel";
import { uploadFn } from "./image-upload";

import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ColorSelector } from "./selectors/color-selector";

import { JSONContent } from "novel";
import "./editor.css";

export default function TailwindEditor() {
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setContent(json);
  }, 500);

  return (
    <EditorRoot>
      <EditorContent
        immediatelyRender={false}
        initialContent={content}
        extensions={defaultExtensions}
        className="relative min-h-[500px] w-full flex-1 p-4 md:p-8"
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        onUpdate={debouncedUpdates}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className="flex w-full cursor-pointer items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
        >
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <TextButtons />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
}

function ImageResizer() {
  return null; // A placeholder if ImageResizer is not available from Novel
}
