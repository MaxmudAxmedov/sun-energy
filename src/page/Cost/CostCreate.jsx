import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function CostCreate() {
    const { t } = useTranslation();
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            items: [{ title: "", price: "" }],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    });

    return (
        <form onSubmit={onSubmit}>
            <DynamicHeader title="additional_expense_add" isCreat={false} />
            <div className="flex justify-end mt-3 gap-3">
                <Button
                    type="button"
                    onClick={() =>
                        append({
                            title: "",
                            price: "",
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
                        className="flex gap-3 mb-3 items-center"
                        key={field.id}
                    >
                        <div>
                            <label
                                htmlFor={`items.${index}.title`}
                                className="text-sm font-medium"
                            >
                                {t("name")}
                            </label>
                            <Controller
                                name={`items.${index}.title`}
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
                                htmlFor={`items.${index}.title`}
                                className="text-sm font-medium"
                            >
                                {t("price")}
                            </label>
                            <Controller
                                name={`items.${index}.price`}
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
                ))}
            </div>
        </form>
    );
}
