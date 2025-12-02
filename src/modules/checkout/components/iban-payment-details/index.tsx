"use client";

import { Text } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { getActiveIbans, Iban } from "@lib/data/iban";
import Radio from "@modules/common/components/radio";
import { clx } from "@medusajs/ui";

type IbanPaymentDetailsProps = {
  selectedIbanId?: string | null;
  onIbanSelect?: (ibanId: string) => void;
};

const IbanPaymentDetails = ({
  selectedIbanId,
  onIbanSelect,
}: IbanPaymentDetailsProps) => {
  const [ibans, setIbans] = useState<Iban[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIban, setSelectedIban] = useState<string | null>(
    selectedIbanId || null
  );

  useEffect(() => {
    const fetchIbans = async () => {
      try {
        const data = await getActiveIbans();
        setIbans(data);
        // Set default IBAN if no selection
        if (data && data.length > 0 && !selectedIban) {
          const defaultIban = data.find((iban) => iban.isDefault) || data[0];
          setSelectedIban(defaultIban.id);
          onIbanSelect?.(defaultIban.id);
        }
      } catch (error) {
        console.error("Error fetching IBANs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIbans();
  }, []);

  useEffect(() => {
    if (selectedIbanId) {
      setSelectedIban(selectedIbanId);
    }
  }, [selectedIbanId]);

  const handleIbanChange = (ibanId: string) => {
    setSelectedIban(ibanId);
    onIbanSelect?.(ibanId);
  };

  if (loading) {
    return (
      <div className="my-4">
        <Text className="txt-medium text-ui-fg-subtle">Yükleniyor...</Text>
      </div>
    );
  }

  if (!ibans || ibans.length === 0) {
    return (
      <div className="my-4">
        <Text className="txt-medium text-ui-fg-subtle">
          IBAN bilgisi bulunamadı.
        </Text>
      </div>
    );
  }

  const selectedIbanData =
    ibans.find((iban) => iban.id === selectedIban) ||
    ibans.find((iban) => iban.isDefault) ||
    ibans[0];

  return (
    <div className="my-4">
      <Text className="txt-medium-plus text-ui-fg-base mb-3">
        Havale Bilgileri
      </Text>

      {ibans.length > 1 && (
        <div className="mb-4 space-y-2">
          {ibans.map((iban) => (
            <div
              key={iban.id}
              className={clx(
                "flex items-center gap-x-3 p-3 border rounded-md cursor-pointer hover:bg-ui-bg-subtle-hover",
                {
                  "border-ui-border-interactive bg-ui-bg-subtle":
                    selectedIban === iban.id,
                }
              )}
              onClick={() => handleIbanChange(iban.id)}
            >
              <Radio checked={selectedIban === iban.id} />
              <div className="flex-1">
                <Text className="txt-medium text-ui-fg-base">
                  {iban.bankName}
                  {iban.branchName && ` - ${iban.branchName}`}
                </Text>
                <Text className="txt-small text-ui-fg-subtle font-mono">
                  {iban.iban}
                </Text>
                {iban.isDefault && (
                  <Text className="txt-small text-ui-fg-muted">
                    (Varsayılan)
                  </Text>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-ui-bg-subtle rounded-md border border-ui-border-base">
        <div className="space-y-2">
          <div>
            <Text className="txt-small text-ui-fg-subtle">Hesap Sahibi:</Text>
            <Text className="txt-medium text-ui-fg-base">
              {selectedIbanData.accountHolderName}
            </Text>
          </div>
          <div>
            <Text className="txt-small text-ui-fg-subtle">IBAN:</Text>
            <Text className="txt-medium text-ui-fg-base font-mono">
              {selectedIbanData.iban}
            </Text>
          </div>
          <div>
            <Text className="txt-small text-ui-fg-subtle">Banka:</Text>
            <Text className="txt-medium text-ui-fg-base">
              {selectedIbanData.bankName}
              {selectedIbanData.branchName &&
                ` - ${selectedIbanData.branchName}`}
            </Text>
          </div>
          {selectedIbanData.description && (
            <div>
              <Text className="txt-small text-ui-fg-subtle">Açıklama:</Text>
              <Text className="txt-medium text-ui-fg-base">
                {selectedIbanData.description}
              </Text>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-ui-border-base">
            <Text className="txt-small text-ui-fg-muted">
              Lütfen ödeme yaparken açıklama kısmına sipariş numaranızı yazmayı
              unutmayın.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IbanPaymentDetails;
