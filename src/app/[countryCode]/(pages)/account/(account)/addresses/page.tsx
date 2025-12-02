import { Metadata } from "next";
import { notFound } from "next/navigation";

import AddressBook from "@modules/account/components/address-book";

import { getRegion } from "@lib/data/regions";
import { retrieveCustomer } from "@lib/data/customer";

export const metadata: Metadata = {
  title: "Adresler | Kmint Shop online E-ticaret şablonu",
  description: "",
};

export default async function AddressesPage(props: {
  params: Promise<{ countryCode: string }>;
}) {
  const params = await props.params;
  const { countryCode } = params;

  const customer = await retrieveCustomer();
  const region = await getRegion(countryCode);

  if (!customer || !region) {
    notFound();
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl font-semibold text-dark">Teslimat Adresleri</h1>
        <p className="text-base text-gray-600">
          Teslimat adreslerinizi görüntüleyin ve güncelleyin, istediğiniz kadar
          adres ekleyebilirsiniz. Adreslerinizi kaydetmek, onları ödeme
          sırasında kullanılabilir hale getirecektir.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  );
}
