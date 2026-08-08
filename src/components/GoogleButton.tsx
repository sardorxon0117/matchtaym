import { googleSignInAction } from "@/actions/auth";

export default function GoogleButton() {
  return (
    <form action={googleSignInAction}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-pill border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink hover:border-primary"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.42 3.58v3h3.91c2.29-2.11 3.53-5.22 3.53-8.82z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.91-3c-1.08.72-2.47 1.16-4.02 1.16-3.09 0-5.71-2.09-6.64-4.89H1.32v3.09C3.29 21.3 7.31 24 12 24z" />
          <path fill="#FBBC05" d="M5.36 14.36c-.24-.72-.38-1.49-.38-2.36s.14-1.64.38-2.36V6.55H1.32C.48 8.21 0 10.05 0 12s.48 3.79 1.32 5.45l4.04-3.09z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.29 2.7 1.32 6.55l4.04 3.09c.93-2.8 3.55-4.89 6.64-4.89z" />
        </svg>
        Google orqali kirish
      </button>
    </form>
  );
}
