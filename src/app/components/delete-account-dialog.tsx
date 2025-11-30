"use client";

import { Trash2 } from "lucide-react";

import useAuth from "@/app/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const DeleteAccountDialog = () => {
  const { deleteAccountMutation } = useAuth();

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          variant="destructive"
          disabled={deleteAccountMutation.isPending}
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          <Trash2 className="size-4" />
          <span>Delete Account</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? This action cannot be
            undone. This will permanently delete:
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li>Your account and profile information</li>
              <li>All your reservations</li>
              <li>All associated data</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
