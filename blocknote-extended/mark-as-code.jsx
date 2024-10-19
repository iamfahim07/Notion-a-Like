import { useEffect, useState } from "react";
import { RiCodeSSlashFill } from "react-icons/ri";

import "@blocknote/mantine/style.css";
import {
  useBlockNoteEditor,
  useComponentsContext,
  useEditorContentOrSelectionChange,
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

  // Don't show when isEditable is false
  if (!editor.isEditable) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
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
