import { getCategories } from "@/lib/queries";
import { deleteCategory } from "@/actions/categories";
import DeleteButton from "@/components/admin/DeleteButton";
import CategoryCreateForm from "@/components/admin/CategoryCreateForm";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink">Kategoriyalar</h1>

      <CategoryCreateForm />

      <ul className="divide-y divide-ink/5 rounded-card border border-ink/10 bg-white">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-ink">{c.name}</p>
              <p className="text-xs text-ink-soft/70">/{c.slug}</p>
            </div>
            <DeleteButton
              action={deleteCategory.bind(null, c.id)}
              confirmText={`"${c.name}" kategoriyasini o'chirishni tasdiqlaysizmi?`}
              successMessage="Kategoriya o'chirildi"
            />
          </li>
        ))}
        {categories.length === 0 && <li className="px-4 py-8 text-center text-ink-soft">Kategoriyalar yo&apos;q</li>}
      </ul>
    </div>
  );
}
