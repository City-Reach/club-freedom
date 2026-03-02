import { AutoLinkNode, LinkNode } from "@lexical/link";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  LINK,
} from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { type EditorState, ParagraphNode, TextNode } from "lexical";
import { type ComponentProps, useCallback } from "react";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Plugins } from "./plugins";

type Props = {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
} & ComponentProps<"div">;

export default function MarkdownEditorWithLinks({
  markdown,
  onMarkdownChange,
  className,
  ...props
}: Props) {
  const handleEditorChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const markdownString = $convertToMarkdownString([LINK]);
        onMarkdownChange(markdownString);
      });
    },
    [onMarkdownChange],
  );

  return (
    <div
      className={cn(
        "bg-background overflow-hidden rounded-lg border",
        className,
      )}
      {...props}
    >
      <LexicalComposer
        initialConfig={{
          namespace: "MarkdownEditorWithLinks",
          theme: editorTheme,
          nodes: [ParagraphNode, TextNode, AutoLinkNode, LinkNode],
          onError: console.log,
          editorState: () => $convertFromMarkdownString(markdown, [LINK]),
        }}
      >
        <TooltipProvider>
          <Plugins />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={handleEditorChange}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
