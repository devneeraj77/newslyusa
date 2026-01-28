import db from "@/lib/prisma";
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
import { ActionButtons } from "@/components/admin/action-buttons";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";

function ContactMessagesTableSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

async function ContactMessagesTable({
  currentPage,
  pageSize,
}: {
  currentPage: number;
  pageSize: number;
}) {
  const skip = (currentPage - 1) * pageSize;

  const [messages, totalCount] = await Promise.all([
    db.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),
    db.contactMessage.count(),
  ]);

  return (
    <div className="space-y-4">
      <div className=" overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-40 text-muted-foreground"
                >
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-medium">
                    {msg.firstName} {msg.lastName}
                  </TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell>{msg.subject}</TableCell>
                  <TableCell className="max-w-xs truncate" title={msg.message}>
                    {msg.message}
                  </TableCell>
                  <TableCell>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <ActionButtons id={msg.id} type="contact" isRead={msg.isRead} email={msg.email} />
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

interface ContactAdminPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ContactAdminPage({ searchParams }: ContactAdminPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
      </div>

      <Suspense fallback={<ContactMessagesTableSkeleton />}>
        <ContactMessagesTable currentPage={currentPage} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}