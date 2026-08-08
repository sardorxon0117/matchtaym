"use client";

export default function DeleteButton({
  action,
  confirmText = "Rostdan ham o'chirmoqchimisiz?",
  children = "O'chirish",
  className = "text-sm font-medium text-red-600 hover:underline",
}: {
  action: () => void;
  confirmText?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
