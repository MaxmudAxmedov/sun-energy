import { CustomDrawer } from "@/components/component/CustomDrawer";
import { Button } from "@/components/ui/button";
import { CustomEditIcon } from "@/assets/icons/custom-edit-icon";
import { Input } from "@/components/ui/input";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paidEmployess } from "@/service/employee";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

export default function EmployePaidDrawer({ isOpen, setIsOpen, data, paid }) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const form = useForm({
        defaultValues: {
            total_paid: "",
        },
    });
    const { watch, reset } = form;

    const usePaidEmployeeMutation = () => {
        return useMutation({
            mutationFn: ({ id, paid }) => paidEmployess(id, paid),
            onSuccess: () => {
                queryClient.invalidateQueries(["employee-id"]);
                queryClient.invalidateQueries(["employees"]);
                reset();
            },
            onError: (error) => {
                console.error("To‘lovda xatolik:", error);
            },
        });
    };
    const { mutate, isPending, isSuccess } = usePaidEmployeeMutation();

    // useEffect(() => {
    //     if (data) {
    //         form.reset({
    //             total_paid: data?.payments?.total_paid,
    //         });
    //     }
    // }, [data, form]);
    const onSubmit = (payload) => {
        mutate({ id: data?.id, paid: payload?.total_paid });
    };

    return (
        <CustomDrawer
            size="md"
            title={"To'lov"}
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
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex gap-3"
                    >
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

                <Table className="bg-white dark:bg-darkPrimaryColor rounded-md mt-2 max-h-[90vh]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[5%]">#</TableHead>
                            <TableHead className="w-[30%]">
                                {t("date")}
                            </TableHead>

                            <TableHead className="text-right w-[22%]">
                                {/* {t("price")} */} To'landi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paid &&
                            paid?.map((item, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="w-[5%]">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="w-[26%]">
                                            {item.created_at}
                                        </TableCell>
                                        <TableCell className="w-[30%] text-right">
                                            {Number(
                                                item?.amount_paid
                                            )?.toLocaleString()}{" "}
                                            sum
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </div>
        </CustomDrawer>
    );
}
