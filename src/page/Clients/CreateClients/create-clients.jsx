import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndividualForm } from "../component/individual-form";
import { LegalForm } from "../component/legal-form";
import { getBusinessClientById } from "@/service/client";
import { useQuery } from "@tanstack/react-query";

export default function CreateClients() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("jismoniy");

  const { data: clientData } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getBusinessClientById(id),
    enabled: !!id,
  });

  // useEffect(() => {
  //   if (clientData?.company_name) {
  //     setSelectedTab("yuridik");
  //   } else {
  //     setSelectedTab("jismoniy");
  //   }
  // }, [clientData, id]);
  useEffect(() => {
    if (clientData?.company_name && id) {
      setSelectedTab(clientData?.company_name ? "yuridik" : "jismoniy");
    }
  }, [id, clientData]);
  return (
    <div className="tablet:h-screen">
      <h1 className="text-2xl font-bold mb-6 pt-6">
        {id ? "Edit client" : t("createClient")}
      </h1>

      <Tabs
        className="w-full"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid max-w-[460px] grid-cols-2">
          <TabsTrigger className="max-w-[230px]" value="jismoniy">
            {t("individualsClients")}
          </TabsTrigger>
          <TabsTrigger className="max-w-[230px]" value="yuridik">
            {t("legalClients")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jismoniy">
          <IndividualForm />
        </TabsContent>

        <TabsContent value="yuridik">
          <LegalForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

{
  /*
    <FormField
    control={form.control}
    name="percent_for_employee_custom"
    render={({ field }) => (
      <FormItem>
        <FormLabel
          htmlFor="percent_for_employee_custom"
          className="text-gray-700 dark:text-white font-medium"
        >
          {t("percentForEmployee")}
        </FormLabel>
        <FormControl>
          <Input
            placeholder={t("enterPercentForEmployee")}
            {...field}
            className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  
  */
}
