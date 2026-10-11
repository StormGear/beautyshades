import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { toggleAnnouncementActive, deleteAnnouncement } from "../actions";
import { AdminButton } from "@/components/AdminButton";
import { AdminAnnouncementForm } from "@/components/AdminAnnouncementForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Announcements" };

export default async function AdminAnnouncementsPage() {
  await requireAdmin();
  const announcements = await prisma.announcement.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Storefront Header</p>
          <h1 className="mt-2 font-serif text-4xl">Announcements</h1>
          <p className="mt-2 text-sm text-muted">
            Manage the scrolling top bar announcement ticker displayed at the very top of the store.
          </p>
        </div>
        <div className="text-right">
          <span className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink ring-1 ring-black/5">
            {announcements.length} {announcements.length === 1 ? "announcement" : "announcements"} (
            {announcements.filter((a) => a.active).length} active)
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Existing Announcements List & Editors */}
        <div className="space-y-6 lg:col-span-2">
          {announcements.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-8 text-center">
              <p className="text-sm font-medium text-ink/70">No announcements found in the database.</p>
              <p className="mt-1 text-xs text-muted">Add your first one using the form on the right.</p>
            </div>
          ) : (
            announcements.map((item) => (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 transition ${
                  item.active ? "ring-black/10" : "opacity-75 ring-black/5"
                }`}
              >
                {/* Header row: badge, status toggle, delete */}
                <div className="flex items-center justify-between gap-3 border-b border-black/5 pb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        item.active
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                          : "bg-gray-100 text-gray-600 ring-1 ring-gray-400/20"
                      }`}
                    >
                      {item.active ? "● Active" : "○ Paused"}
                    </span>
                    <span className="text-xs font-medium text-muted">Order #{item.order}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <form action={toggleAnnouncementActive}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="active" value={item.active ? "false" : "true"} />
                      <AdminButton
                        type="submit"
                        variant="text"
                        className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink hover:underline"
                        loadingText={item.active ? "Pausing…" : "Activating…"}
                      >
                        {item.active ? "Pause" : "Activate"}
                      </AdminButton>
                    </form>

                    <form action={deleteAnnouncement}>
                      <input type="hidden" name="id" value={item.id} />
                      <AdminButton
                        type="submit"
                        variant="danger"
                        className="text-xs font-semibold uppercase tracking-wider text-rose-600 hover:underline"
                        confirmMessage="Are you sure you want to delete this announcement?"
                        loadingText="Deleting…"
                      >
                        Delete
                      </AdminButton>
                    </form>
                  </div>
                </div>

                <AdminAnnouncementForm announcement={item} />
              </div>
            ))
          )}
        </div>

        {/* Create New Announcement Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-pink">Create New</p>
            <h2 className="mt-1 font-serif text-2xl">New Announcement</h2>
            <p className="mt-1 text-xs text-muted">
              Add a new announcement banner item to the live top ticker.
            </p>

            <AdminAnnouncementForm compact nextOrder={announcements.length + 1} />
          </div>
        </div>
      </div>
    </div>
  );
}
