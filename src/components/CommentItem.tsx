"use client";

import { useState } from "react";
import Image from "next/image";
import { formatRelativeUz } from "@/lib/utils";
import { deleteComment } from "@/actions/comments";
import CommentForm from "./CommentForm";
import DeleteButton from "./admin/DeleteButton";

const STAFF_ROLES = new Set(["ADMIN", "EDITOR"]);

export type CommentData = {
  id: string;
  content: string;
  createdAt: string | Date;
  author: { id: string; name: string; image: string | null; role: string };
  replies: CommentData[];
};

export default function CommentItem({
  comment,
  articleId,
  currentUser,
  depth = 0,
}: {
  comment: CommentData;
  articleId: string;
  currentUser: { id: string; role: string } | null;
  depth?: number;
}) {
  const [replying, setReplying] = useState(false);
  const isStaffAuthor = STAFF_ROLES.has(comment.author.role);
  const isStaffViewer = !!currentUser && STAFF_ROLES.has(currentUser.role);
  const canDelete = !!currentUser && (currentUser.id === comment.author.id || isStaffViewer);
  const initial = comment.author.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className={depth > 0 ? "ml-6 border-l border-ink/10 pl-4 sm:ml-10" : ""}>
      <div className="flex gap-3 py-4">
        {comment.author.image ? (
          <Image src={comment.author.image} alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
            {initial}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink">{comment.author.name}</span>
            {isStaffAuthor && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
                MatchTaym jamoasi
              </span>
            )}
            <span className="text-xs text-ink-soft/60">{formatRelativeUz(comment.createdAt)}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-ink-soft">{comment.content}</p>

          <div className="mt-1 flex items-center gap-4">
            {isStaffViewer && !replying && (
              <button
                onClick={() => setReplying(true)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Javob yozish
              </button>
            )}
            {canDelete && (
              <DeleteButton
                action={deleteComment.bind(null, comment.id)}
                confirmText="Izohni o'chirishni tasdiqlaysizmi?"
                className="text-xs font-medium text-red-600 hover:underline"
                successMessage="Izoh o'chirildi"
              >
                O&apos;chirish
              </DeleteButton>
            )}
          </div>

          {replying && (
            <div className="mt-3 max-w-md">
              <CommentForm
                articleId={articleId}
                parentId={comment.id}
                placeholder="Javobingizni yozing…"
                submitLabel="Javob yuborish"
                autoFocus
                onDone={() => setReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} articleId={articleId} currentUser={currentUser} depth={depth + 1} />
      ))}
    </div>
  );
}
