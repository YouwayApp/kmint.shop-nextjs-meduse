"use client";

import { Plus } from "@medusajs/icons";
import { Button, Heading } from "@medusajs/ui";
import { useEffect, useState, useActionState } from "react";

import useToggleState from "@lib/hooks/use-toggle-state";
import CountrySelect from "@modules/checkout/components/country-select";
import Input from "@modules/common/components/input";
import Modal from "@modules/common/components/modal";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import { HttpTypes } from "@medusajs/types";
import { addCustomerAddress } from "@lib/data/customer";

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion;
  addresses: HttpTypes.StoreCustomerAddress[];
}) => {
  const [successState, setSuccessState] = useState(false);
  const { state, open, close: closeModal } = useToggleState(false);

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  });

  const close = () => {
    setSuccessState(false);
    closeModal();
  };

  useEffect(() => {
    if (successState) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState]);

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true);
    }
  }, [formState]);

  return (
    <>
      <button
        className="border border-gray-3 rounded-lg p-5 min-h-[220px] h-full w-full flex flex-col justify-between hover:border-blue hover:bg-blue-50 transition-colors duration-200"
        onClick={open}
        data-testid="add-address-button"
      >
        <span className="text-base font-medium text-dark">Yeni Adres Ekle</span>
        <Plus className="text-blue" />
      </button>

      <Modal
        isOpen={state}
        close={close}
        data-testid="add-address-modal"
        size="medium"
      >
        <Modal.Title>
          <Heading className="mb-4">Yeni Adres Ekle</Heading>
        </Modal.Title>
        <form action={formAction} className="flex flex-col h-full">
          <Modal.Body>
            <div className="flex flex-col gap-y-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ad"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Soyad"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Şirket"
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label="Adres"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Daire, apartman vb."
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-1 sm:grid-cols-[144px_1fr] gap-4">
                <Input
                  label="Posta Kodu"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label="Şehir"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <Input
                label="İl / Bölge"
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label="Telefon"
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-sm py-2 mt-4"
                data-testid="address-error"
              >
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6 w-full justify-end">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10 px-6"
                data-testid="cancel-button"
              >
                İptal
              </Button>
              <SubmitButton data-testid="save-button" className="h-10 px-6">
                Kaydet
              </SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default AddAddress;
