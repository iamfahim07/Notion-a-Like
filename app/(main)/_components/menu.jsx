"use client";

import { useMutation } from "convex/react";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

export const Menu = ({ initialData }) => {
  const router = useRouter();
  const { user } = useUser();

  const update = useMutation(api.documents.update);
  const archive = useMutation(api.documents.archive);

  const onLock = (e) => {
    e.stopPropagation();

    update({
      id: initialData._id,
      isLocked: !initialData.isLocked,
    });
  };

  const onArchive = () => {
    const promise = archive({ id: initialData._id });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });

    router.push("/documents");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem>
          <div
            className="w-full flex items-center justify-between cursor-pointer"
            onClick={(e) => onLock(e)}
          >
            Lock page
            <Switch
              className="data-[state=checked]:bg-blue-400"
              checked={initialData.isLocked}
            />
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
