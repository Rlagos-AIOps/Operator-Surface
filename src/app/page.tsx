import { redirect } from "next/navigation";

/**
 * Root route — redirects to /accounts (the Book), which is the operator's
 * primary working surface. The Hub-style at-a-glance Overview lives at
 * /overview and is reachable from the masthead nav.
 */
export default function RootPage(): never {
  redirect("/accounts");
}
