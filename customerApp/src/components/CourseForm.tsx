import { Input } from "./ui/input";
import type { Course } from "../types/course-types";
import { useForm } from "react-hook-form";
import PaymentPicker from "./ui/PaymentPicker";
import { useState } from "react";
import type { PaymentType } from "../types/course-types";

type CourseFormProps = {
  course?: Course;
  onSubmit?: (data: { name: string; description: string; paymentTypes: PaymentType[] }) => void;
};

const CourseForm = ({ course, onSubmit }: CourseFormProps) => {
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<PaymentType[]>(
    course?.paymentTypes || [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: course?.name || "",
      description: course?.description || "",
    },
  });

  const onFormSubmit = (data: { name: string; description: string }) => {
    onSubmit?.({
      ...data,
      paymentTypes: selectedPaymentTypes,
    });
  };

  console.log("Selected payment types:", selectedPaymentTypes);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="flex flex-col gap-6 mt-3">
        <div>
          <Input placeholder="Kursname" label="Kursname" className="w-100" {...register("name")} />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        <div>
          <Input label="Beschreibung" className="w-100" {...register("description")} />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description.message}</span>
          )}
        </div>
        <PaymentPicker selected={selectedPaymentTypes} onChange={setSelectedPaymentTypes} />
      </div>
    </form>
  );
};

export default CourseForm;
