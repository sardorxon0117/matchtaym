import Link from "next/link";
import { createAdContract } from "@/actions/ad-contract";

export default function NewAdContractPage() {
  return (
    <div>
      <Link href="/admin/reklama-shartnomalari" className="mb-3 block text-xs font-medium text-primary hover:underline">
        ← Ro&apos;yxatga qaytish
      </Link>
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink">Yangi reklama shartnomasi</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Faqat soatlik narxni kiriting — qolgan hamma narsani (ism, muddat) reklama beruvchining o&apos;zi havola orqali
        to&apos;ldiradi va imzolaydi.
      </p>

      <form action={createAdContract} className="max-w-sm space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">1 soatlik reklama narxi (so&apos;m)</span>
          <input type="number" name="hourlyRateUzs" required min={1} step={1} placeholder="50000" className="input" />
        </label>
        <button
          type="submit"
          className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Yaratish va havola olish
        </button>
      </form>
    </div>
  );
}
