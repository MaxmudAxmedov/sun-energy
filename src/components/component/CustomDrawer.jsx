import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

export function CustomDrawer({
    title,
    children,
    action,
    open,
    setOpen,
    trigger,
    size = "lg",
}) {
    const sizeClasses = {
        sx: "max-w-[300px]",
        sm: "max-w-[400px]",
        md: "max-w-[600px]",
        lg: "max-w-[800px]",
    };
    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {trigger || <Button variant="outline">Drawer ochish</Button>}
            </DrawerTrigger>
            <DrawerContent
                className={`flex flex-col overflow-y-scroll overflow-x-hidden w-full ${sizeClasses[size]}`}
            >
                <DrawerHeader className={"border-b"}>
                    <div className="flex justify-between items-center px-4">
                        <DrawerTitle className="text-[30px]">
                            {title}
                        </DrawerTitle>
                        <DrawerClose asChild>
                            <Button
                                variant="outline"
                                className="bg-red-600 hover:bg-red-500 hover:text-white text-white"
                            >
                                X
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>
                <div className="p-4">{children}</div>
                <DrawerFooter>{action}</DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
