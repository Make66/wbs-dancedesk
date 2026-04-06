import { useForm, Controller } from "react-hook-form";
import type { Course } from "../types/course-types";
import { FaCalendarAlt } from "react-icons/fa";
import PaymentPicker from "./PaymentPicker";
import ContractTypesPicker from "./ContractTypesPicker";
import FormDatePicker from "./form/DatePicker";

type CourseFormProps = {
  course?: Course;
};

type CourseFormValues = {
  name: string;
  description: string;
  paymentTypes: Course["paymentTypes"];
  contractTypes: Course["contractTypes"];
  startsAt: Date | undefined;
  endsAt: Date | undefined;
};

const CourseForm = ({ course }: CourseFormProps) => {
  const { register, control, handleSubmit, watch, setValue } = useForm<CourseFormValues>({
    defaultValues: {
      name: course?.name || "",
      description: course?.description || "",
      paymentTypes: course?.paymentTypes || [],
      contractTypes: course?.contractTypes || [],
      startsAt: course?.startsAt ? new Date(course.startsAt) : undefined,
      endsAt: course?.endsAt ? new Date(course.endsAt) : undefined,
    },
  });

  const watchedValues = watch();

  console.log("PAYMENT TYPES:", watchedValues.paymentTypes);
  console.log("CONTRACT TYPES:", watchedValues.contractTypes);
  console.log("STARTS AT:", watchedValues.startsAt);
  console.log("ENDS AT:", watchedValues.endsAt);

  const onSubmit = (values: CourseFormValues) => {
    console.log("FORM SUBMIT:", values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-12"
    >
      <div className="col-span-3">
        <input
          type="text"
          placeholder="Kursname"
          {...register("name")}
          className="text-3xl w-full font-bold focus:outline-none focus:ring-0 focus:shadow-none"
        />
        <input
          type="text"
          placeholder="Kursbeschreibung"
          {...register("description")}
          className="text-lg w-full mt-4 mb-12 focus:outline-none focus:ring-0 focus:shadow-none"
        />
      </div>

      <div className="col-span-3 md:col-span-2">
        <div className="p-2 rounded-2xl bg-blue-400/60">
          <div className="pt-2 pl-3 flex items-center">
            <FaCalendarAlt className="inline mr-4 text-2xl" />
            <span className="text-2xl font-semibold">Termine</span>
          </div>

          <div className="mt-4">
            <FormDatePicker
              startsAt={watch("startsAt")}
              endsAt={watch("endsAt")}
              onChange={({ startsAt, endsAt }) => {
                setValue("startsAt", startsAt);
                setValue("endsAt", endsAt);
              }}
              className="w-full bg-background border border-muted-foreground rounded-2xl cursor-pointer overflow-hidden"
            />
          </div>
        </div>

        <div className="my-12 border-t" />

        <Controller
          control={control}
          name="contractTypes"
          render={({ field }) => (
            <ContractTypesPicker selected={field.value} onChange={field.onChange} />
          )}
        />

        <button type="submit"></button>

        <div className="my-12 border-t" />

        <Controller
          control={control}
          name="paymentTypes"
          render={({ field }) => <PaymentPicker selected={field.value} onChange={field.onChange} />}
        />
      </div>

      <div></div>
    </form>
  );
};

export default CourseForm;
