import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndividualForm } from "../component/individual-form";
import { LegalForm } from "../component/legal-form";
import { useQuery } from "@tanstack/react-query";
import {
    getClientsBusinessByIdQuery,
    getClientsCustomerByIdQuery,
} from "@/quires/quires";

export default function CreateClients() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [selectedTab, setSelectedTab] = useState("jismoniy");

    const { data: clientsBusiness } = useQuery({
        ...getClientsBusinessByIdQuery(id),
        enabled: !!id,
    });

    const { data: clientsCustomer } = useQuery({
        ...getClientsCustomerByIdQuery(id),
        enabled: !!id,
    });

    useEffect(() => {
        if (clientsBusiness != undefined) {
            setSelectedTab("yuridik");
        } else {
            setSelectedTab("jismoniy");
        }
    }, [id]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 pt-6">
                {id ? "Edit client" : t("createClient")}
            </h1>

            <Tabs
                className="w-full"
                value={selectedTab}
                onValueChange={setSelectedTab}
            >
                <TabsList className="grid max-w-[460px] grid-cols-2">
                    <TabsTrigger
                        className="max-w-[230px]"
                        value="jismoniy"
                        disabled={!!id && clientsBusiness != undefined}
                    >
                        {t("individualsClients")}
                    </TabsTrigger>
                    <TabsTrigger
                        className="max-w-[230px]"
                        value="yuridik"
                        disabled={!!id && clientsCustomer != undefined}
                    >
                        {t("legalClients")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent className="h-[80vh]" value="jismoniy">
                    <IndividualForm />
                </TabsContent>

                <TabsContent value="yuridik">
                    <LegalForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
