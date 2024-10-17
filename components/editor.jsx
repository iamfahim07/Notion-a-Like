"use client";

import { useMutation } from "convex/react";
import { useTheme } from "next-themes";
import { RiChat1Line } from "react-icons/ri";

import { Callout } from "@/blocknote-extended/callout";
import { api } from "@/convex/_generated/api";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  blockTypeSelectItems,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";

/* Our schema with block specs, which contain the configs and implementations for blocks that we want our editor to use. */
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Callout block.
    callout: Callout,
  },
});

// Slash menu item to insert an Alert block
const insertAlert = (editor) => ({
  title: "Callout",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "callout",
    });
  },
  aliases: [
    "alert",
    "notification",
    "emphasize",
    "warning",
    "error",
    "info",
    "success",
  ],
  group: "Other",
  icon: <RiChat1Line />,
});

export default function Editor({ editable, onChange, initialContent }) {
  const { resolvedTheme } = useTheme();

  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const generateImageUrl = useMutation(api.documents.generateImageUrl);

  const handleUpload = async (file) => {
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const { storageId } = await result.json();

    return await generateImageUrl({
      storageId: storageId,
    });
  };

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUpload,
  });

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      formattingToolbar={false}
      slashMenu={false}
      onChange={() => onChange?.(JSON.stringify(editor.document))}
    >
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar
            blockTypeSelectItems={[
              ...blockTypeSelectItems(editor.dictionary),
              {
                name: "Callout",
                type: "callout",
                icon: RiChat1Line,
                isSelected: (block) => block.type === "callout",
              },
            ]}
          />
        )}
      />

      {/* Replaces the default Slash Menu. */}
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          // Gets all default slash menu items and `insertAlert` item.
          filterSuggestionItems(
            [...getDefaultReactSlashMenuItems(editor), insertAlert(editor)],
            query
          )
        }
      />
    </BlockNoteView>
  );
}
