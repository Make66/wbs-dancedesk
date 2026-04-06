import { TbContract } from "react-icons/tb";
import ContractTypesPicker from "./ContractTypesPicker";
import type { ContractType, PaymentType } from "../../types/course-types";
import { Controller, useFormContext } from "react-hook-form";
import type { CourseFormValues } from "../../types/form";
import PaymentPicker from "./PaymentPicker";

const ContractSection = () => {
  const { control } = useFormContext<CourseFormValues>();

  return (
    <div className="p-2 rounded-2xl bg-orange-400/40 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="pt-2 pl-3 flex items-center justify-between col-span-1 md:col-span-2">
        <div className="flex items-center">
          <TbContract className="inline mr-4 text-2xl" />
          <span className="text-2xl font-semibold">Vertragsdaten</span>
        </div>
      </div>
      <div className="mt-3 col-span-1 md:col-span-2 gap-3">
        <Controller
          control={control}
          name="contractTypes"
          render={({ field }) => (
            <ContractTypesPicker
              selected={field.value as ContractType[] | undefined}
              onChange={field.onChange}
            />
          )}
        />
      </div>
      <div>
        <Controller
          control={control}
          name="paymentTypes"
          render={({ field }) => (
            <PaymentPicker
              selected={field.value as PaymentType[] | undefined}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ContractSection;
