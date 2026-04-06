import { useState } from "react";
import type { Course } from "../types/course-types";
import PaymentPicker from "./PaymentPicker";
import ContractTypesPicker from "./ContractTypesPicker";
import { DatePicker } from "./ui/DatePicker";
import { FaPlay } from "react-icons/fa";
import { cn } from "../lib/utils";
import FormDatePicker from "./form/FormDatePicker";

type CourseFormProps = {
  course?: Course;
};

const CourseForm = ({ course }: CourseFormProps) => {
  const [formData, setFormData] = useState({
    name: course?.name || "",
    description: course?.description || "",
    paymentTypes: course?.paymentTypes || [],
    contractTypes: course?.contractTypes || [],
    startsAt: course?.startsAt ? new Date(course.startsAt) : undefined,
    endsAt: course?.endsAt ? new Date(course.endsAt) : undefined,
  });

  console.log("PAYMENT TYPES:", formData.paymentTypes);
  console.log("CONTRACT TYPES:", formData.contractTypes);
  console.log("STARTS AT:", formData.startsAt);

  return (
    <form className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-12">
      <div className="xl:col-span-2">
        <input
          type="text"
          defaultValue={course?.name}
          placeholder="Kursname"
          className="text-3xl w-full font-bold focus:outline-none focus:ring-0 focus:shadow-none"
        />
        <input
          type="text"
          defaultValue={course?.description}
          placeholder="Kursbeschreibung"
          className="text-lg w-full mt-4 mb-12 focus:outline-none focus:ring-0 focus:shadow-none"
        />
        <div className="flex">
          <FormDatePicker
            type="start"
            value={formData.startsAt}
            onChange={(date) => setFormData({ ...formData, startsAt: date })}
            className="h-22 w-60 border border-muted-foreground py-4 px-6 rounded-2xl cursor-pointer hover:bg-blue-400"
          />
          <FormDatePicker
            type="end"
            value={formData.endsAt}
            onChange={(date) => setFormData({ ...formData, endsAt: date })}
            className="h-22 w-60 border border-muted-foreground py-4 px-6 rounded-2xl cursor-pointer hover:bg-blue-400"
          />
        </div>
        <div className="my-12 border-t" />
        <ContractTypesPicker
          selected={formData.contractTypes}
          onChange={(contractTypes) => setFormData({ ...formData, contractTypes })}
        />
        <button></button>
        <div className="my-12 border-t" />
        <PaymentPicker
          selected={formData.paymentTypes}
          onChange={(paymentTypes) => setFormData({ ...formData, paymentTypes })}
        />
      </div>
      <div></div>
    </form>
  );
};

export default CourseForm;
