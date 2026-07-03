import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createProject } from "@/lib/actions";
import Sidebar from "@/components/Sidebar";
import { X } from "lucide-react";
import Link from "next/link";
import NewProjectForm from "@/components/NewProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;
  const clients = await prisma.client.findMany({ where: { ownerId: userId } });

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 flex items-center justify-center min-h-screen px-10 py-10">
        <NewProjectForm clients={clients} />
      </main>
    </div>
  );
}
