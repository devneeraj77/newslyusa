import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import db from "@/lib/prisma";
import { ActionButtons } from "@/components/admin/action-buttons";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";

function SubscriptionsTableSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Subscribed At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-[250px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[80px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

async function SubscriptionsTable({
  currentPage,
  pageSize,
}: {
  currentPage: number;
  pageSize: number;
}) {
  const skip = (currentPage - 1) * pageSize;

  const [subscribers, totalCount] = await Promise.all([
    db.subscriber.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),
    db.subscriber.count(),
  ]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center h-40 text-muted-foreground"
                >
                  No subscriptions found.
                </TableCell>
              </TableRow>
            ) : (
              subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">
                    {subscriber.email}
                  </TableCell>
                  <TableCell>
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {/* @ts-ignore */}
                    <ActionButtons id={subscriber.id} type="subscriber" isRead={subscriber.isRead} email={subscriber.email as string} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationWithLinks
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
}

interface SubscriptionsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubscriptionsPage({ searchParams }: SubscriptionsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
      </div>

      <Suspense fallback={<SubscriptionsTableSkeleton />}>
        <SubscriptionsTable currentPage={currentPage} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}