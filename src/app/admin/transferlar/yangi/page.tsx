import { getArticlesMinimal } from "@/lib/queries";
import { createTransfer } from "@/actions/transfers";
import TransferForm from "@/components/admin/TransferForm";

export default async function NewTransferPage() {
  const articles = await getArticlesMinimal();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink">Yangi transfer</h1>
      <TransferForm action={createTransfer} articles={articles} />
    </div>
  );
}
