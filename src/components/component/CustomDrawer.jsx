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
}) {
    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {trigger || <Button variant="outline">Drawer ochish</Button>}
            </DrawerTrigger>
            <DrawerContent className="flex flex-col">
                <DrawerHeader className={"border-b"}>
                    <div className="flex justify-between items-center px-4">
                        <DrawerTitle className="text-[30px]">
                            {title}
                        </DrawerTitle>
                        <DrawerClose asChild>
                            <Button variant="outline">X</Button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>
                <div className="p-4">{children}</div>
                <DrawerFooter>{action}</DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
