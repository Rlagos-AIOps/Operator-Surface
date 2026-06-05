import { redirect } from "next/navigation";

/**
 * Root route — redirects to /brief (the Daily Brief), which is the operator's
 * first-look surface. The Book lives at /accounts, the Hub-style at-a-glance
 * Overview lives at /overview, and both are reachable from the masthead nav.
 */
export default function RootPage(): never {
  redirect("/brief");
}
