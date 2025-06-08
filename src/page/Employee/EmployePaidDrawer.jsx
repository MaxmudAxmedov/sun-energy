import { CustomDrawer } from "@/components/component/CustomDrawer";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { CustomEditIcon } from "@/assets/icons/custom-edit-icon";
import { Input } from "@/components/ui/input";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paidEmployess } from "@/service/employee";

export default function EmployePaidDrawer({ isOpen, setIsOpen, data }) {
    const queryClient = useQueryClient();
    const form = useForm({
        defaultValues: {
            total_paid: "",
        },
    });
    const { watch } = form;

    const usePaidEmployeeMutation = () => {
        return useMutation({
            mutationFn: ({ id, paid }) => paidEmployess(id, paid),
            onSuccess: () => {
                queryClient.invalidateQueries(["employee-id"]);
            },
            onError: (error) => {
                console.error("To‘lovda xatolik:", error);
            },
        });
    };
    const { mutate, isPending, isSuccess } = usePaidEmployeeMutation();

    useEffect(() => {
        if (data) {
            form.reset({
                total_paid: data?.payments?.total_paid,
            });
        }
    }, [data, form]);
    const onSubmit = (payload) => {
        mutate({ id: data?.id, paid: payload?.total_paid });
    };

    return (
        <CustomDrawer
            size="md"
            title={"paid"}
            open={isOpen}
            setOpen={setIsOpen}
            trigger={
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`rounded-full bg-gray-500 hover:bg-slate-600 w-[38px] h-[35px] mx-auto`}
                >
                    <CustomEditIcon />
                </Button>
            }
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
                        <FormField
                            control={form.control}
                            name="total_paid"
                            render={({ field }) => (
                                <>
                                    <Input pleceholder="paid" {...field} />
                                </>
                            )}
                        />
                        <Button>Submit</Button>
                    </form>
                </Form>
            </div>
        </CustomDrawer>
    );
}
