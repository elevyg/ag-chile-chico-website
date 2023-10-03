import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes, LexicalEditor } from "lexical";
import { ComponentProps, type FC } from "react";
import {
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  Divider,
  Editor,
  EditorComposer,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  ToolbarPlugin,
  UnderlineButton,
} from "verbum";

type Props = ComponentProps<typeof Editor> & { initialHTMLContent?: string };

const TextEditor: FC<Props> = (props) => {
  return (
    <EditorComposer
      initialEditorState={(editor: LexicalEditor) => {
        if (!props.initialHTMLContent) return;
        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(
            props.initialHTMLContent!,
            "text/html",
          );

          const nodes = $generateNodesFromDOM(editor, dom);

          $getRoot().select();

          $insertNodes(nodes);
        });
      }}
    >
      <Editor {...props} hashtagsEnabled={true}>
        <ToolbarPlugin>
          <FontSizeDropdown />
          <Divider />
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <CodeFormatButton />
          <InsertLinkButton />
          <TextColorPicker />
          <BackgroundColorPicker />
          <TextFormatDropdown />
          <Divider />
          <InsertDropdown enablePoll={true} />
          <Divider />
          <AlignDropdown />
        </ToolbarPlugin>
      </Editor>
    </EditorComposer>
  );
};

export default TextEditor;
