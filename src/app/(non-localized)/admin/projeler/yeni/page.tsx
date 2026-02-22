import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import NewProjectForm from "./components/NewProjectForm";

export default async function NewProjectPage() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    if (session.role === "VIEWER") {
        redirect("/admin/projeler");
    }

    return <NewProjectForm />;
}
