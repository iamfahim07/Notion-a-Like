"use client";

import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useCoverImage } from "@/hooks/use-cover-image";

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.documents.update);
  const coverImage = useCoverImage();
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const generateImageUrl = useMutation(api.documents.generateImageUrl);
  const removeImage = useMutation(api.documents.removeImage);

  const [file, setFile] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      if (coverImage.storageId) {
        await removeImage({ storageId: coverImage.storageId });
      }

      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      const imageUrl = await generateImageUrl({
        storageId: storageId,
      });

      await update({
        id: params.documentId,
        coverImage: JSON.stringify({
          storageId,
          imageUrl,
        }),
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Cover Image
          </DialogTitle>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
