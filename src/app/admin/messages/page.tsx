import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { deleteRecord, setHandled } from "../actions";
import { AdminButton } from "@/components/AdminButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Inbox</p>
      <h1 className="mt-2 font-serif text-4xl">Messages</h1>
      <div className="mt-8 space-y-4">
        {messages.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
        {messages.map((message) => (
          <article key={message.id} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{message.name}</h2>
                <a href={`mailto:${message.email}`} className="text-sm text-muted">
                  {message.email}
                </a>
              </div>
              <p className="text-xs text-muted">{message.createdAt.toLocaleString("en-GB")}</p>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{message.message}</p>
            <div className="mt-4 flex gap-3">
              <form action={setHandled}>
                <input type="hidden" name="kind" value="message" />
                <input type="hidden" name="id" value={message.id} />
                <input type="hidden" name="handled" value={message.handled ? "false" : "true"} />
                <AdminButton
                  type="submit"
                  variant="text"
                  className="text-[11px] uppercase tracking-widest text-pink hover:text-ink"
                  loadingText="Updating…"
                >
                  {message.handled ? "Mark unread" : "Mark handled"}
                </AdminButton>
              </form>
              <form action={deleteRecord}>
                <input type="hidden" name="kind" value="message" />
                <input type="hidden" name="id" value={message.id} />
                <AdminButton
                  type="submit"
                  variant="danger"
                  className="text-[11px] uppercase tracking-widest text-red-600 hover:text-red-700"
                  confirmMessage="Are you sure you want to delete this message?"
                  loadingText="Deleting…"
                >
                  Delete
                </AdminButton>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
