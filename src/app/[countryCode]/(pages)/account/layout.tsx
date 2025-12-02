import { Toaster } from "react-hot-toast";
import { retrieveCustomer } from "@lib/data/customer";
import { redirect } from "next/navigation";

export default async function AccountPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
