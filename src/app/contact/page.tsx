import { redirect } from "next/navigation";

export default async function ResourcesPage() {
  redirect("/?contactModal=true");
}
