"use client";

import Content from "@/components/commonPages/Content";
import PageHeader from "@/components/commonPages/PageHeader";
import InsightsOverview from "../components/common/InsightsOverview";
import { Separator } from "@/components/ui/separator";
import { BlackBoxForm, FormSchemaType } from "@/components/home/BlackboxForm";
import useBlackBoxMagic from "@/lib/useBlackBoxMagic";

export default function Home() {
  const { result, ready, blackboxify } = useBlackBoxMagic();

  const handleOnSubmit = (data: FormSchemaType) => {
    blackboxify(data.text || data.web_address || "");
  };

  return (
    <>
      <PageHeader title="Acasǎ" />

      <Content>
        <BlackBoxForm handleOnSubmit={handleOnSubmit} />

        <Separator className="my-10" />
        <InsightsOverview isHomePage />
      </Content>
    </>
  );
}
