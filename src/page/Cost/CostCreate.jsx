import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutateData } from "@/hook/useApi";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function CostCreate() {
    const { t } = useTranslation();
    const { mutate } = useMutateData();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            items: [{ name: "", amount: "", description: "" }],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const onSubmit = handleSubmit((data) => {
        const body = {
            amount: Number(data?.items[0].amount),
            description: data?.items[0].description,
            name: data?.items[0].name,
        };
        mutate({
            endpoint: "/expense",
            data: body,
            navigatePath: "/cost",
            toastCreateMessage: "contractCreated",
            mutateQueryKey: "expenses",
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <DynamicHeader title="additional_expense_add" isCreat={false} />
            <div className="flex justify-end mt-3 gap-3">
                <Button
                    type="button"
                    onClick={() =>
                        append({
                            name: "",
                            amount: "",
                            description: "",
                        })
                    }
                >
                    {t("add")}
                </Button>
                <Button>{t("submit")}</Button>
            </div>
            <div className="mt-3">
                {fields.map((field, index) => (
                    <div
                        className="flex flex-col gap-3 mb-5 relative"
                        key={field.id}
                    >
                        <span className="absolute top-0 left-[-50px] dark:text-white">
                            {index + 1}
                        </span>
                        <div className="flex gap-3">
                            <div>
                                <label
                                    htmlFor={`items.${index}.name`}
                                    className="text-sm font-medium"
                                >
                                    {t("name")}
                                </label>
                                <Controller
                                    name={`items.${index}.name`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            a
                                            placeholder={t("name")}
                                            className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor={`items.${index}.amount`}
                                    className="text-sm font-medium"
                                >
                                    {t("price")}
                                </label>
                                <Controller
                                    name={`items.${index}.amount`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder={t("price")}
                                            className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                        />
                                    )}
                                />
                            </div>

                            <Button
                                type="button"
                                size="sx"
                                variant="destructive"
                                onClick={() => remove(index)}
                            >
                                X
                            </Button>
                        </div>

                        <div>
                            <label
                                htmlFor={`items.${index}.description`}
                                className="text-sm font-medium"
                            >
                                {/* {t("description")} */}
                                Qo'shimcha
                            </label>
                            <Controller
                                name={`items.${index}.description`}
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        type="text"
                                        placeholder={t("qo'shimcha...")}
                                        {...field}
                                        className="bigTablet:w-[611px] w-[300px] tablet:w-[450px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                    />
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </form>
    );
}
