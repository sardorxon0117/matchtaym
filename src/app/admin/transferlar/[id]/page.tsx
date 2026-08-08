import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getArticlesMinimal } from "@/lib/queries";
import { updateTransfer, deleteTransfer } from "@/actions/transfers";
import TransferForm from "@/components/admin/TransferForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditTransferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [transfer, articles] = await Promise.all([
    prisma.transfer.findUnique({ where: { id } }),
    getArticlesMinimal(),
  ]);

  if (!transfer) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-ink">Transferni tahrirlash</h1>
        <DeleteButton action={deleteTransfer.bind(null, transfer.id)}>O&apos;chirish</DeleteButton>
      </div>
      <TransferForm
        action={updateTransfer.bind(null, transfer.id)}
        articles={articles}
        initial={{
          playerName: transfer.playerName,
          playerImage: transfer.playerImage ?? "",
          fromClub: transfer.fromClub,
          toClub: transfer.toClub,
          fee: transfer.fee ?? "",
          status: transfer.status,
          date: transfer.date.toISOString().slice(0, 10),
          league: transfer.league ?? "",
          relatedArticleId: transfer.relatedArticleId ?? "",
        }}
      />
    </div>
  );
}
