import AuthButton from "@/components/AuthButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full mb-3">
        <div className="py-6 font-bold bg-purple-950 text-center">
          This is a protected page that you can only see as an authenticated
          user
        </div>
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <h1 className="text-3xl">Appointments</h1>
            <AuthButton />
          </div>
        </nav>
      </div>
      {children}
    </>
  );
}
