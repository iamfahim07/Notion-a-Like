"use client";

import { useMutation } from "convex/react";
import { useTheme } from "next-themes";
import { RiChat1Line } from "react-icons/ri";

import { Callout } from "@/blocknote-extended/callout";
import { MarkAsCodeStyle } from "@/blocknote-extended/custom-styles/mark-as-code-style";
import { MarkAsCode } from "@/blocknote-extended/mark-as-code";
import { api } from "@/convex/_generated/api";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultStyleSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  SuggestionMenuController,
  TextAlignButton,
  UnnestBlockButton,
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
  styleSpecs: {
    // Adds all default styles.
    ...defaultStyleSpecs,
    // Adds the Font style.
    markAsCodeStyle: MarkAsCodeStyle,
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
          // blockTypeSelectItems={[
          //   ...blockTypeSelectItems(editor.dictionary),
          //   {
          //     name: "Callout",
          //     type: "callout",
          //     icon: RiChat1Line,
          //     isSelected: (block) => block.type === "callout",
          //   },
          // ]}
          >
            <BlockTypeSelect
              key={"blockTypeSelect"}
              items={[
                ...blockTypeSelectItems(editor.dictionary),
                {
                  name: "Callout",
                  type: "callout",
                  icon: RiChat1Line,
                  isSelected: (block) => block.type === "callout",
                },
              ]}
            />

            <FileCaptionButton key={"fileCaptionButton"} />
            <FileReplaceButton key={"replaceFileButton"} />

            <BasicTextStyleButton
              basicTextStyle={"bold"}
              key={"boldStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"italic"}
              key={"italicStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"underline"}
              key={"underlineStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"strike"}
              key={"strikeStyleButton"}
            />
            {/* Extra button to toggle code styles */}
            {/* <BasicTextStyleButton
              key={"codeStyleButton"}
              basicTextStyle={"code"}
            /> */}

            {/* Extra button to toggle mark as code */}
            <MarkAsCode key={"customButton"} />

            <TextAlignButton
              textAlignment={"left"}
              key={"textAlignLeftButton"}
            />
            <TextAlignButton
              textAlignment={"center"}
              key={"textAlignCenterButton"}
            />
            <TextAlignButton
              textAlignment={"right"}
              key={"textAlignRightButton"}
            />

            <ColorStyleButton key={"colorStyleButton"} />

            <NestBlockButton key={"nestBlockButton"} />
            <UnnestBlockButton key={"unnestBlockButton"} />

            <CreateLinkButton key={"createLinkButton"} />
          </FormattingToolbar>
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
