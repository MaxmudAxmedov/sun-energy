import { useRef } from "react";
import Draggable from "react-draggable";
import { X } from "lucide-react";
import Calculator from "./Calculator";

export default function CalculatorModal({ open, setOpen }) {
    const nodeRef = useRef(null);

    if (!open) return null;

    return (
        <Draggable handle=".drag-handle" nodeRef={nodeRef}>
            <div
                ref={nodeRef}
                className="fixed top-20 left-20 z-50 w-[400px] bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-300 dark:border-zinc-700"
            >
                <div className="drag-handle cursor-move bg-gray-100 dark:bg-zinc-800 p-3 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-lg font-semibold">Calculator</h2>
                    <button onClick={() => setOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4">
                    <Calculator />
                </div>
            </div>
        </Draggable>
    );
}
