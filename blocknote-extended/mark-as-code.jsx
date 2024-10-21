import { useEffect, useState } from "react";
import { RiCodeSSlashFill } from "react-icons/ri";

import { checkBlockIsFileBlock } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import {
  useBlockNoteEditor,
  useComponentsContext,
  useEditorContentOrSelectionChange,
  useSelectedBlocks,
} from "@blocknote/react";

// Custom Formatting Toolbar Button to MarkAsCode.
export function MarkAsCode() {
  const editor = useBlockNoteEditor();

  const Components = useComponentsContext();

  // Tracks whether the text & background are both blue.
  const [isSelected, setIsSelected] = useState(
    editor.getActiveStyles().markAsCodeStyle === "14px"
  );

  // Updates state on content or selection change.
  useEditorContentOrSelectionChange(() => {
    setIsSelected(editor.getActiveStyles().markAsCodeStyle === "14px");
  }, editor);

  useEffect(() => {
    const onCtrlPlusEKeyPress = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
        event.preventDefault();
        event.stopImmediatePropagation();

        editor.toggleStyles({
          markAsCodeStyle: "14px",
        });
      }
    };

    document.addEventListener("keydown", onCtrlPlusEKeyPress, true);

    return () =>
      document.removeEventListener("keydown", onCtrlPlusEKeyPress, true);
  }, []);

  const selectedBlocks = useSelectedBlocks(editor);

  const block = selectedBlocks.length === 1 ? selectedBlocks[0] : undefined;

  // Don't show when isEditable is false or selected content in file
  if (!editor.isEditable || checkBlockIsFileBlock(block, editor)) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      label={"Mark as code"}
      mainTooltip={"Mark as code"}
      secondaryTooltip={"Ctrl+E"}
      onClick={() => {
        editor.toggleStyles({
          markAsCodeStyle: "14px",
        });

        // editor.addStyles({
        //     padding: fontName,
        //   });
      }}
      isSelected={isSelected}
      icon={<RiCodeSSlashFill />}
    />
  );
}
