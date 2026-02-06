import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ListingForm } from "@/components/admin/listing-form";

export default async function NewListingPage() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    return <ListingForm isNew />;
}
