import { createClient } from "@/utils/supabase/server";
import App from "./app"

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <App />

}
