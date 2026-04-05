import { Input } from "./ui/input";
import type { Course } from "../types/course-types";
import { useForm } from "react-hook-form";
import PaymentPicker from "./ui/PaymentPicker";
import CourseSeatChart from "./CourseSeatChart";
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
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-6 mt-3">
          <div>
            <Input
              placeholder="Kursname"
              className="w-full"
              label="Kursname"
              {...register("name")}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>
          <div>
            <Input label="Beschreibung" {...register("description")} />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </div>
          <PaymentPicker selected={selectedPaymentTypes} onChange={setSelectedPaymentTypes} />
          <div className="grid grid-cols-5 mt-5">
            {course?.dates && course.dates.length > 0 ? (
              course.dates.map((date) => (
                <div
                  key={date.date}
                  className="p-4 border rounded flex items-center justify-center"
                >
                  <p className="font-semibold">{new Date(date.date).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-4">Keine Termine verfügbar</p>
            )}
          </div>
        </div>
        {course && (
          <div className="flex items-center justify-center">
            <CourseSeatChart course={course} />
          </div>
        )}
      </div>
    </form>
  );
};

export default CourseForm;
