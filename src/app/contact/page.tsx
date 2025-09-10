import { redirect } from "next/navigation";

export default async function ContactPage() {
  redirect("/?contactModal=true");
}
