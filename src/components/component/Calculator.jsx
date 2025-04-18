import { useState, useEffect, useRef } from "react";
import { evaluate } from "mathjs";

const Calculator = () => {
    const [display, setDisplay] = useState("0");
    const btns = [
        "7",
        "8",
        "9",
        "/",
        "4",
        "5",
        "6",
        "*",
        "1",
        "2",
        "3",
        "-",
        "0",
        ".",
        "=",
        "+",
        "C",
        "X",
    ];
    const calculatorRef = useRef(null);

    const handleButtonClick = (value) => {
        if (value === "=") {
            try {
                setDisplay(evaluate(display).toString());
            } catch {
                setDisplay("Xato");
            }
        } else if (value === "C") {
            setDisplay("0");
        } else if (value === "X") {
            setDisplay((prev) => {
                if (prev === "0" || prev === "Xato") return "0";
                if (prev.length === 1) return "0";
                return prev.slice(0, -1);
            });
        } else {
            setDisplay((prev) =>
                prev === "0" || prev === "Xato" ? value : prev + value
            );
        }
    };

    const handleKeyDown = (event) => {
        const { key } = event;

        if (/[0-9+\-*/.]/.test(key)) {
            handleButtonClick(key);
        } else if (key === "Enter") {
            handleButtonClick("=");
        } else if (key === "Backspace") {
            handleButtonClick("X");
        } else if (key === "Escape") {
            handleButtonClick("C");
        }

        if (key === "Enter" || key === "/") {
            event.preventDefault();
        }
    };

    useEffect(() => {
        calculatorRef.current.focus();
    }, []);

    return (
        <div
            className="w-[350px] border border-[#ccc]  mt-10"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            ref={calculatorRef}
        >
            <div className=" p-4 text-2xl text-right">{display}</div>
            <div className="grid grid-cols-4 gap-px border-t border-[#ccc]">
                {btns.map((btn) => (
                    <button
                        className="p-5 text-[18px] cursor-pointer hover:bg-[#e0e0e0] border border-[#ccc]"
                        key={btn}
                        onClick={() => handleButtonClick(btn)}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
