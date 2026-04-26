import CurrencyDashboard from "../components/CurrencyDashboard";
import SignedOutHome from "../components/SignedOutHome";
import { readSessionCookie } from "../lib/hackclub-auth";

export default async function Home() {
  const session = await readSessionCookie();

  if (!session?.user) {
    return <SignedOutHome />;
  }

  return <CurrencyDashboard currentUser={session.user} />;
}
