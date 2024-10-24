"use client";

import { useMutation } from "convex/react";
import { Lock, LockOpen } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";

export default function Title({ initialData }) {
  const inputRef = useRef(null);
  const update = useMutation(api.documents.update);

  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);
  const [showLockButton, setShowLockButton] = useState(false);

  const enableInput = () => {
    if (initialData.isLocked) return;

    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event) => {
    setTitle(event.target.value);
    update({
      id: initialData._id,
      title: event.target.value || "Untitled",
    });
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  const onLock = () => {
    update({
      id: initialData._id,
      isLocked: !initialData.isLocked,
    });
    setShowLockButton(true);
  };

  return (
    <div className="flex items-center justify-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}

      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}

      {initialData.isLocked ? (
        <Button
          onClick={onLock}
          variant="ghost"
          size="sm"
          className="font-normal flex items-center gap-2 text-muted-foreground hover:bg-neutral-300 dark:hover:bg-neutral-600"
        >
          <Lock className="h-4 w-4 " />
          Locked
        </Button>
      ) : showLockButton ? (
        <Button
          onClick={onLock}
          variant="outline"
          size="sm"
          className="font-normal flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-neutral-300 dark:hover:bg-neutral-600"
        >
          <LockOpen className="h-4 w-4 " />
          Re-lock
        </Button>
      ) : null}
    </div>
  );
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-20 rounded-md" />;
};
