import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import Calculator from "@/components/component/Calculator";
import { DynamicHeader } from "@/components/component/Dynamic-Header";

export default function Setting() {
    const { i18n } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng);
    };
    return (
        <div>
          <DynamicHeader />
            <div>
                <h2 className="text-textPrimaryColor dark:text-white font-semibold text-[16px] mb-1 mt-4">
                    {t("languageChange")}:
                </h2>
                <DropdownMenu>
                    <DropdownMenuTrigger className="px-4 py-1.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600">
                        {i18n.language.toUpperCase()}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => changeLanguage("en")}
                            className={
                                i18n.language === "en" ? "bg-blue-500/10" : ""
                            }
                        >
                            English
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => changeLanguage("uz")}
                            className={
                                i18n.language === "uz" ? "bg-blue-500/10" : ""
                            }
                        >
                            O'zbekcha
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => changeLanguage("ru")}
                            className={
                                i18n.language === "ru" ? "bg-blue-500/10" : ""
                            }
                        >
                            Русский
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <h2 className="text-textPrimaryColor dark:text-white font-semibold text-[16px] mb-1 mt-4">
                    {t("themeChange")}:
                </h2>
                <div className="flex items-center tablet:gap-4 gap-3">
                    <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="justify-start tablet:max-w-[140px] max-w-[100px] text-[13px] tablet:text-[14px] tablet:py-5 py-4"
                        onClick={() => setTheme("light")}
                    >
                        <Sun className="h-4 w-4" />
                        {t("light")}
                    </Button>
                    <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="justify-start tablet:max-w-[140px] text-[13px] max-w-[100px] tablet:text-[14px] tablet:py-5 py-4"
                        onClick={() => setTheme("dark")}
                    >
                        <Moon className="h-3 w-3 tablet:h-4 tablet:w-4" />
                        {t("dark")}
                    </Button>
                    <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className="justify-start tablet:max-w-[140px] max-w-[100px] text-[13px] tablet:text-[14px] tablet:py-5 py-4"
                        onClick={() => setTheme("system")}
                    >
                        <Monitor className="h-4 w-4" />
                        {t("system")}
                    </Button>
                </div>
                <Calculator />
            </div>
        </div>
    );
}
