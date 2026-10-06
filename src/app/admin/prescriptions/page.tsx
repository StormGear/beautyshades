import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { deleteRecord, setHandled } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prescriptions" };

export default async function AdminPrescriptionsPage() {
  await requireAdmin();
  const rows = await prisma.prescription.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Optical</p>
      <h1 className="mt-2 font-serif text-4xl">Prescriptions</h1>
      <div className="mt-8 space-y-4">
        {rows.length === 0 && <p className="text-sm text-muted">No prescriptions submitted yet.</p>}
        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-medium">{row.name || "Unnamed"}</h2>
                <p className="text-sm text-muted">
                  {row.phone} {row.email ? `· ${row.email}` : ""}
                </p>
              </div>
              <p className="text-xs text-muted">{row.createdAt.toLocaleString("en-GB")}</p>
            </div>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              <div>OD SPH {row.odSph || "—"}</div>
              <div>OD CYL {row.odCyl || "—"}</div>
              <div>OD Axis {row.odAxis || "—"}</div>
              <div>OS SPH {row.osSph || "—"}</div>
              <div>OS CYL {row.osCyl || "—"}</div>
              <div>OS Axis {row.osAxis || "—"}</div>
              <div>PD {row.pd || "—"}</div>
            </dl>
            {row.notes && <p className="mt-3 text-sm text-muted">{row.notes}</p>}
            <div className="mt-4 flex gap-3">
              <form action={setHandled}>
                <input type="hidden" name="kind" value="prescription" />
                <input type="hidden" name="id" value={row.id} />
                <input type="hidden" name="handled" value={row.handled ? "false" : "true"} />
                <button className="text-[11px] uppercase tracking-widest text-pink">
                  {row.handled ? "Mark unread" : "Mark handled"}
                </button>
              </form>
              <form action={deleteRecord}>
                <input type="hidden" name="kind" value="prescription" />
                <input type="hidden" name="id" value={row.id} />
                <button className="text-[11px] uppercase tracking-widest text-red-600">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
