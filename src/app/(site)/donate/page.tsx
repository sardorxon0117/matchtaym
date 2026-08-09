import type { Metadata } from "next";
import DonateInterestForm from "@/components/DonateInterestForm";
import FeedbackForm from "@/components/FeedbackForm";

export const metadata: Metadata = { title: "Donate" };

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink sm:text-3xl">Loyihani qo&apos;llab-quvvatlang</h1>
      <p className="mb-8 text-ink-soft">MatchTaymni yanada yaxshilashda bizga yordam bering.</p>

      <section className="mb-8 rounded-card border border-ink/10 bg-white p-5 sm:p-6">
        <h2 className="mb-3 font-heading text-lg font-semibold text-ink">Hozirgi holatimiz</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Sayt server, ma&apos;lumotlar bazasi va futbol statistikasi xizmatlarining barchasi hozircha bepul va
          cheklangan (limitli) tariflarda ishlaydi. Aynan shu sabab ba&apos;zida sahifalar sekinroq yuklanishi yoki
          ba&apos;zi funksiyalar cheklangan bo&apos;lishi mumkin. Loyihani tezroq, barqarorroq serverlarga va kengroq
          imkoniyatlarga o&apos;tkazish uchun sizning yordamingiz biz uchun juda muhim.
        </p>
      </section>

      <section className="mb-8 rounded-card border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <h2 className="mb-3 font-heading text-lg font-semibold text-ink">Donate funksiyasi tez orada</h2>
        <p className="mb-4 text-sm leading-relaxed text-ink-soft">
          Hozirda <span className="font-semibold text-ink">Click</span> to&apos;lov tizimi bilan hamkorlik yuzasidan
          muzokara olib bormoqdamiz, biroq shartnoma jarayoni hali yakunlanmagan. Shartnoma imzolangach, xavfsiz
          &quot;Donate qilish&quot; funksiyasi tez orada saytga qo&apos;shiladi. Hozirdanoq yordam bermoqchi bo&apos;lsangiz
          yoki funksiya ishga tushganda birinchilardan bo&apos;lib xabardor bo&apos;lishni istasangiz, quyidagi forma
          orqali biz bilan bog&apos;laning.
        </p>
        <DonateInterestForm />
      </section>

      <section className="mb-8 rounded-card border border-ink/10 bg-white p-5 sm:p-6">
        <h2 className="mb-3 font-heading text-lg font-semibold text-ink">Reklama joylashtirish</h2>
        <p className="mb-4 text-sm leading-relaxed text-ink-soft">
          Saytimizda reklama joylashtirmoqchi bo&apos;lsangiz — reklama shartlari, joylari va narxlari haqida
          ma&apos;lumot olish uchun Telegram orqali to&apos;g&apos;ridan-to&apos;g&apos;ri biz bilan bog&apos;lanishingiz mumkin.
        </p>
        <a
          href="https://t.me/sardorkhon_me"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Telegram orqali murojaat qilish →
        </a>
      </section>

      <section className="rounded-card border border-ink/10 bg-white p-5 sm:p-6">
        <h2 className="mb-1 font-heading text-lg font-semibold text-ink">Taklif va shikoyatlar</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Sayt bo&apos;yicha fikringiz, taklifingiz yoki shikoyatingiz bormi? Bizga yozing — albatta o&apos;qib chiqamiz.
        </p>
        <FeedbackForm />
      </section>
    </div>
  );
}
