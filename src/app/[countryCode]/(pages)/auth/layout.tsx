import { Toaster } from "react-hot-toast";

export default async function AccountPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
