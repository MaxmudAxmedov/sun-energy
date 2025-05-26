import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutateData } from "@/hook/useApi";
import { getExpenseByIdQuery } from "@/quires/quires";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function CostCreate() {
    const { t } = useTranslation();
    const { mutate } = useMutateData();
    const { id } = useParams();
    const [fieldKey, setFieldKey] = useState(0);
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            extra_expenses: [{ name: "", amount: "", description: "" }],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "extra_expenses",
    });

    const { data } = useQuery({
        ...getExpenseByIdQuery(id),
        enabled: !!id,
    });
    useEffect(() => {
        if (data?.data) {
            reset({
                extra_expenses: [data?.data]?.map((i) => {
                    return {
                        name: i.name,
                        amount: Number(i.amount),
                        description: i.description,
                    };
                }),
            });
            setFieldKey((prev) => prev + 1);
        }
    }, [data, reset]);

    const onSubmit = handleSubmit((data) => {
        const update = data?.extra_expenses?.map((i) => ({ ...i, id }));
        mutate({
            endpoint: "/expense",
            data: id ? update[0] : data,
            method: id ? "PUT" : "POST",
            navigatePath: "/cost",
            toastCreateMessage: id ? "expenses_update" : "expenses_create",
            mutateQueryKey: "/expenses",
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <DynamicHeader title="additional_expense_add" isCreat={false} />
            <div className="flex justify-end mt-3 gap-3">
                {!id && (
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
                )}

                <Button>{id ? t("save") : t("submit")} </Button>
            </div>
            <div className="mt-3">
                {fields.map((field, index) => (
                    <div
                        className="flex flex-col gap-3 mb-5 relative"
                        key={`${field.id}-${fieldKey}`}
                    >
                        <span className="absolute top-0 left-[-50px] dark:text-white">
                            {index + 1}
                        </span>
                        <div className="flex gap-3">
                            <div>
                                <label
                                    htmlFor={`extra_expenses.${index}.name`}
                                    className="text-sm font-medium"
                                >
                                    {t("name")}
                                </label>
                                <Controller
                                    name={`extra_expenses.${index}.name`}
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
                                    htmlFor={`extra_expenses.${index}.amount`}
                                    className="text-sm font-medium"
                                >
                                    {t("price")}
                                </label>
                                <Controller
                                    name={`extra_expenses.${index}.amount`}
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
                                htmlFor={`extra_expenses.${index}.description`}
                                className="text-sm font-medium"
                            >
                                {t("info")}
                            </label>
                            <Controller
                                name={`extra_expenses.${index}.description`}
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        type="text"
                                        placeholder={t("info")}
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
