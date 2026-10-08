import React from "react";

export function Shimmer({ className = "" }: { className?: string }) {
  return <div className={`shimmer-base ${className}`} />;
}

export function AdminHeaderSkeleton({
  badgeWidth = "w-20",
  titleWidth = "w-52",
  subtitleWidth,
  hasAction = false,
  actionWidth = "w-32",
}: {
  badgeWidth?: string;
  titleWidth?: string;
  subtitleWidth?: string;
  hasAction?: boolean;
  actionWidth?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Shimmer className={`h-3 ${badgeWidth} rounded-full`} />
        <Shimmer className={`mt-3 h-9 ${titleWidth} rounded-lg`} />
        {subtitleWidth && <Shimmer className={`mt-2 h-4 ${subtitleWidth} rounded`} />}
      </div>
      {hasAction && <Shimmer className={`h-10 ${actionWidth} rounded-full`} />}
    </div>
  );
}

export function AdminOverviewSkeleton() {
  return (
    <div className="animate-pulse-slow">
      <AdminHeaderSkeleton badgeWidth="w-20" titleWidth="w-44" subtitleWidth="w-64" />

      {/* Metric Cards Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <Shimmer className="h-3 w-28 rounded" />
            <Shimmer className="mt-3 h-9 w-16 rounded-md" />
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="mt-12">
        <Shimmer className="h-7 w-40 rounded-md" />
        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
          <div className="border-b border-black/5 bg-[#f7f1e6]/50 px-4 py-3">
            <div className="grid grid-cols-4 gap-4">
              <Shimmer className="h-3 w-20 rounded" />
              <Shimmer className="h-3 w-16 rounded" />
              <Shimmer className="h-3 w-16 rounded" />
              <Shimmer className="h-3 w-16 rounded" />
            </div>
          </div>
          <div className="divide-y divide-black/5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 items-center gap-4 px-4 py-3.5">
                <div>
                  <Shimmer className="h-4 w-32 rounded" />
                  <Shimmer className="mt-1.5 h-3 w-40 rounded" />
                </div>
                <Shimmer className="h-4 w-20 rounded" />
                <Shimmer className="h-5 w-16 rounded-full" />
                <Shimmer className="h-3.5 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminProductsSkeleton() {
  return (
    <div>
      <AdminHeaderSkeleton badgeWidth="w-16" titleWidth="w-36" hasAction actionWidth="w-32" />

      {/* Search Input Skeleton */}
      <div className="mt-6">
        <Shimmer className="h-10 max-w-sm rounded-lg" />
      </div>

      {/* Products Table Card */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
        <div className="border-b border-black/5 bg-[#f7f1e6]/50 px-4 py-3">
          <div className="grid grid-cols-5 gap-4">
            <Shimmer className="h-3 w-20 rounded" />
            <Shimmer className="h-3 w-20 rounded" />
            <Shimmer className="h-3 w-16 rounded" />
            <Shimmer className="h-3 w-16 rounded" />
            <div />
          </div>
        </div>
        <div className="divide-y divide-black/5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 items-center gap-4 px-4 py-3">
              <div className="flex items-center gap-3">
                <Shimmer className="h-12 w-10 shrink-0 rounded object-cover" />
                <div className="space-y-1.5">
                  <Shimmer className="h-4 w-36 rounded" />
                  <Shimmer className="h-2.5 w-16 rounded" />
                </div>
              </div>
              <Shimmer className="h-4 w-24 rounded" />
              <Shimmer className="h-4 w-16 rounded" />
              <Shimmer className="h-4 w-12 rounded" />
              <div className="flex justify-end gap-3">
                <Shimmer className="h-3.5 w-10 rounded" />
                <Shimmer className="h-3.5 w-12 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminCategoriesSkeleton() {
  return (
    <div>
      <AdminHeaderSkeleton badgeWidth="w-16" titleWidth="w-40" />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <Shimmer className="h-3 w-20 rounded" />
            <div className="mt-4 space-y-4">
              <Shimmer className="h-10 w-full rounded" />
              <Shimmer className="h-10 w-full rounded" />
              <Shimmer className="h-10 w-full rounded" />
              <Shimmer className="h-20 w-full rounded" />
            </div>
            <Shimmer className="mt-5 h-9 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminOrdersSkeleton() {
  return (
    <div>
      <AdminHeaderSkeleton badgeWidth="w-12" titleWidth="w-32" />

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>

      {/* Orders Table */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
        <div className="border-b border-black/5 bg-[#f7f1e6]/50 px-4 py-3">
          <div className="grid grid-cols-5 gap-4">
            <Shimmer className="h-3 w-20 rounded" />
            <Shimmer className="h-3 w-16 rounded" />
            <Shimmer className="h-3 w-16 rounded" />
            <Shimmer className="h-3 w-16 rounded" />
            <Shimmer className="h-3 w-16 rounded" />
          </div>
        </div>
        <div className="divide-y divide-black/5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 items-center gap-4 px-4 py-3.5">
              <div>
                <Shimmer className="h-4 w-32 rounded" />
                <Shimmer className="mt-1.5 h-3 w-28 rounded" />
              </div>
              <Shimmer className="h-4 w-10 rounded" />
              <Shimmer className="h-4 w-20 rounded" />
              <Shimmer className="h-5 w-20 rounded-full" />
              <Shimmer className="h-3.5 w-28 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminAnnouncementsSkeleton() {
  return (
    <div className="max-w-5xl">
      <AdminHeaderSkeleton
        badgeWidth="w-32"
        titleWidth="w-60"
        subtitleWidth="w-96"
        hasAction
        actionWidth="w-36"
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Announcements list */}
        <div className="space-y-6 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <div className="flex items-center gap-2">
                  <Shimmer className="h-5 w-20 rounded-full" />
                  <Shimmer className="h-4 w-16 rounded" />
                </div>
                <div className="flex gap-3">
                  <Shimmer className="h-4 w-14 rounded" />
                  <Shimmer className="h-4 w-14 rounded" />
                </div>
              </div>
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Shimmer className="h-10 rounded" />
                  <Shimmer className="h-10 rounded" />
                  <Shimmer className="h-10 rounded" />
                </div>
                <Shimmer className="h-16 w-full rounded" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Shimmer className="h-10 rounded" />
                  <Shimmer className="h-10 rounded" />
                </div>
                <div className="flex justify-end pt-2">
                  <Shimmer className="h-9 w-44 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create form card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/10">
            <Shimmer className="h-3 w-24 rounded-full" />
            <Shimmer className="mt-2 h-7 w-48 rounded" />
            <Shimmer className="mt-2 h-4 w-full rounded" />
            <div className="mt-6 space-y-4">
              <Shimmer className="h-10 rounded" />
              <Shimmer className="h-20 rounded" />
              <div className="grid grid-cols-2 gap-3">
                <Shimmer className="h-10 rounded" />
                <Shimmer className="h-10 rounded" />
              </div>
              <Shimmer className="mt-4 h-10 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminMessagesSkeleton() {
  return (
    <div>
      <AdminHeaderSkeleton badgeWidth="w-12" titleWidth="w-36" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Shimmer className="h-5 w-36 rounded" />
                <Shimmer className="mt-1 h-3.5 w-48 rounded" />
              </div>
              <Shimmer className="h-3.5 w-28 rounded" />
            </div>
            <div className="mt-4 space-y-2">
              <Shimmer className="h-4 w-full rounded" />
              <Shimmer className="h-4 w-3/4 rounded" />
            </div>
            <div className="mt-4 flex gap-3">
              <Shimmer className="h-4 w-24 rounded" />
              <Shimmer className="h-4 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminPrescriptionsSkeleton() {
  return (
    <div>
      <AdminHeaderSkeleton badgeWidth="w-16" titleWidth="w-44" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <Shimmer className="h-5 w-40 rounded" />
                <Shimmer className="mt-1.5 h-3.5 w-48 rounded" />
              </div>
              <Shimmer className="h-3.5 w-24 rounded" />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, j) => (
                <Shimmer key={j} className="h-4 w-28 rounded" />
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <Shimmer className="h-4 w-24 rounded" />
              <Shimmer className="h-4 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminProductFormSkeleton() {
  return (
    <div>
      <AdminHeaderSkeleton badgeWidth="w-16" titleWidth="w-48" />
      <div className="mt-8 max-w-2xl space-y-5">
        <Shimmer className="h-10 w-full rounded" />
        <Shimmer className="h-10 w-full rounded" />
        <Shimmer className="h-28 w-full rounded" />
        <div className="rounded-2xl border-2 border-dashed border-black/10 bg-[#f7f1e6]/30 p-8">
          <div className="flex flex-col items-center">
            <Shimmer className="h-10 w-10 rounded-full" />
            <Shimmer className="mt-3 h-4 w-40 rounded" />
            <Shimmer className="mt-2 h-3 w-56 rounded" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Shimmer className="h-10 rounded" />
          <Shimmer className="h-10 rounded" />
          <Shimmer className="h-10 rounded" />
        </div>
        <Shimmer className="h-10 w-full rounded" />
        <div className="flex items-center gap-2">
          <Shimmer className="h-4 w-4 rounded" />
          <Shimmer className="h-4 w-36 rounded" />
        </div>
        <Shimmer className="h-11 w-40 rounded-full" />
      </div>
    </div>
  );
}

export function AdminOrderDetailSkeleton() {
  return (
    <div className="max-w-3xl">
      <AdminHeaderSkeleton badgeWidth="w-12" titleWidth="w-44" subtitleWidth="w-60" />
      <Shimmer className="mt-2 h-4 w-72 rounded" />
      <div className="mt-8 space-y-3 rounded-2xl bg-white p-6 ring-1 ring-black/5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Shimmer className="h-4 w-40 rounded" />
            <Shimmer className="h-4 w-20 rounded" />
          </div>
        ))}
        <div className="border-t border-black/5 pt-3">
          <div className="flex justify-between">
            <Shimmer className="h-4 w-20 rounded" />
            <Shimmer className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Shimmer className="h-10 w-40 rounded" />
        <Shimmer className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}
