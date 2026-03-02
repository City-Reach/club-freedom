import { AutoLinkNode, LinkNode } from "@lexical/link";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  LINK,
} from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { type EditorState, ParagraphNode, TextNode } from "lexical";
import { useCallback } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Plugins } from "./plugins";

type Props = {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
};

export default function MarkdownEditorWithLinks({
  markdown,
  onMarkdownChange,
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
    <LexicalComposer
      initialConfig={{
        namespace: "MarkdownEditorWithLinks",
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
  );
}
