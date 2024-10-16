"use client";

import { useMutation } from "convex/react";
import { useTheme } from "next-themes";

import { api } from "@/convex/_generated/api";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

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
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUpload,
  });

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={() => onChange?.(JSON.stringify(editor.document))}
    />
  );
}
