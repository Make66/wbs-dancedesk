import { TbContract } from "react-icons/tb";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "../../types/form";
import { useEffect, useMemo, useState } from "react";
import ContractModal from "./ContractModal";
import type { Contract } from "../../types/course-types";
import ContractItem from "./ContractItem";

const emptyContract: Contract = {
  title: "",
  amount: 0,
  installments: 1,
  autoEnd: false,
  paymentTypes: [],
  isActive: true,
};

const ContractSection = () => {
  const { watch, setValue } = useFormContext<CourseFormValues>();

  const formContracts = watch("contracts") ?? [];

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setContracts(formContracts);
  }, [formContracts]);

  const sortedContracts = useMemo(() => {
    return contracts
      .map((contract, index) => ({ contract, index }))
      .sort((a, b) => Number(b.contract.isActive) - Number(a.contract.isActive));
  }, [contracts]);

  const editingContract = useMemo(() => {
    if (editingIndex === null) return emptyContract;
    return contracts[editingIndex] ?? emptyContract;
  }, [editingIndex, contracts]);

  const syncContracts = (updatedContracts: Contract[]) => {
    setContracts(updatedContracts);
    setValue("contracts", updatedContracts, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const openCreateModal = () => {
    setEditingIndex(null);
    setIsContractModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setIsContractModalOpen(true);
  };

  const handleClose = () => {
    setIsContractModalOpen(false);
    setEditingIndex(null);
  };

  const handleSaveContract = (contract: Contract) => {
    const updatedContracts =
      editingIndex === null
        ? [...contracts, contract]
        : contracts.map((item, index) => (index === editingIndex ? contract : item));

    syncContracts(updatedContracts);
    handleClose();
  };

  const handleDeleteContract = (indexToDelete: number) => {
    const updatedContracts = contracts.filter((_, index) => index !== indexToDelete);
    syncContracts(updatedContracts);
  };

  const handleToggleActive = (index: number, isActive: boolean) => {
    const updatedContracts = contracts.map((contract, i) =>
      i === index ? { ...contract, isActive } : contract,
    );
    syncContracts(updatedContracts);
  };

  return (
    <div className="p-2 rounded-2xl bg-orange-400/40 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="pt-2 pl-3 flex items-center justify-between col-span-1 md:col-span-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <TbContract className="inline mr-4 text-2xl" />
            <span className="text-2xl font-semibold line-clamp-1">Vertragsdaten</span>
          </div>

          <button onClick={openCreateModal} type="button">
            <IoMdAddCircleOutline className="cursor-pointer text-3xl mr-3" />
          </button>
        </div>
      </div>

      <div className="mt-3 col-span-1 md:col-span-2 gap-3 flex flex-col">
        {contracts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-muted-foreground p-4 text-sm text-muted-foreground">
            Noch keine Verträge hinzugefügt.
          </div>
        ) : (
          sortedContracts.map(({ contract, index }) => (
            <div key={index}>
              <ContractItem
                contract={contract}
                handleEdit={openEditModal}
                index={index}
                handleDelete={handleDeleteContract}
                handleToggleActive={handleToggleActive}
              />
            </div>
          ))
        )}
      </div>

      {isContractModalOpen && (
        <ContractModal
          isOpen={isContractModalOpen}
          onClose={handleClose}
          initialValues={editingContract}
          onSave={handleSaveContract}
        />
      )}
    </div>
  );
};

export default ContractSection;
