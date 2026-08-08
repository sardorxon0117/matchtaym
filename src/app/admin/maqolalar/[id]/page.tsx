import { notFound } from "next/navigation";
import { getArticleForEdit, getCategories } from "@/lib/queries";
import { updateArticle, deleteArticle } from "@/actions/articles";
import ArticleForm from "@/components/admin/ArticleForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories] = await Promise.all([getArticleForEdit(id), getCategories()]);

  if (!article) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-ink">Maqolani tahrirlash</h1>
        <DeleteButton action={deleteArticle.bind(null, article.id)}>Maqolani o&apos;chirish</DeleteButton>
      </div>
      <ArticleForm
        action={updateArticle.bind(null, article.id)}
        categories={categories}
        initial={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? "",
          content: article.content,
          coverImage: article.coverImage ?? "",
          categoryId: article.categoryId ?? "",
          tags: article.tags.map((t) => t.name).join(", "),
          status: article.status,
          metaTitle: article.metaTitle ?? "",
          metaDesc: article.metaDesc ?? "",
        }}
      />
    </div>
  );
}
