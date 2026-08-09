import { getCategories } from "@/lib/queries";
import { createArticle } from "@/actions/articles";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink">Yangi maqola</h1>
      <ArticleForm action={createArticle} categories={categories} mode="create" />
    </div>
  );
}
