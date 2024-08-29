"use client";

import Content from "@/components/commonPages/Content";
import PageHeader from "@/components/commonPages/PageHeader";
import InsightsOverview from "../components/common/InsightsOverview";
import { Separator } from "@/components/ui/separator";
import { BlackBoxForm, FormSchemaType } from "@/components/home/BlackboxForm";
import useBlackBoxMagic from "@/lib/useBlackBoxMagic";
import { BlackboxResults } from "@/components/home/BlacboxResults";

export default function Home() {
  const { result, ready, blackboxify } = useBlackBoxMagic();

  const handleOnSubmit = (data: FormSchemaType) => {
    blackboxify(data.text || data.web_address || "");
  };

  return (
    <>
      <PageHeader title="Detectie stiri false cu AI" />
      {/* to columns one of 1/2 and one of 2/3  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BlackBoxForm handleOnSubmit={handleOnSubmit} />

        <BlackboxResults result={result} ready={!!ready} />
      </div>

      <Content>
        <Separator className="my-10" />
        <h2 className="text-xl font-bold mb-4">Statistici set de date</h2>
        <InsightsOverview isHomePage />
      </Content>
    </>
  );
}
