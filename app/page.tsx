"use client";

import Content from "@/components/commonPages/Content";
import PageHeader from "@/components/commonPages/PageHeader";
import InsightsOverview from "../components/common/InsightsOverview";
import { Separator } from "@/components/ui/separator";
import { BlackBoxForm, FormSchemaType } from "@/components/home/BlackboxForm";
import useBlackBoxMagic from "@/lib/useBlackBoxMagic";
import { BlackboxResults } from "@/components/home/BlacboxResults";
import Link from "next/link";

export default function Home() {
  const { result, ready, blackboxify } = useBlackBoxMagic();

  const handleOnSubmit = (data: FormSchemaType) => {
    const type = data.type === "free_text" ? "text" : "url";
    const text = type === "text" ? data.text : data.web_address;
    blackboxify(text || "", type);
  };

  return (
    <>
      <PageHeader title="Detectie stiri false cu AI" />
      {/* to columns one of 1/2 and one of 2/3  */}
      <div className="md:flex md:justify-start">
        <BlackBoxForm handleOnSubmit={handleOnSubmit} />

        <BlackboxResults result={result} ready={ready} />
      </div>

      <Content>
        <Separator className="my-10" />
        <h2 className="text-xl font-bold mb-4">Statistici set de date</h2>
        <div className="my-4 text-sm text-muted-foreground">
          In antrenarea acestui model AI a fost utilizat un dataset compus din
          articole de știri colectate de pe platforma{" "}
          <Link
            href="https://veridica.ro"
            className="underline"
            target="_blank"
          >
            Veridica
          </Link>
          , o sursă care monitorizează și identifică știrile false și
          dezinformările în combinație cu datasetul open-source{" "}
          <Link
            href="https://huggingface.co/datasets/mateiaass/FakeRom"
            className="underline"
            target="_blank"
          >
            FakeRom
          </Link>
          {". "}
          Dataset-ul obținut astfel conține informații variate, fiecare articol
          fiind asociat cu un tag specific care indică tipul de conținut al său.
          Acesta a fost utilizat pentru a antrena un model de clasificare a
          știrilor false, model ce este folosit pentru a genera rezultatele de
          mai sus.
        </div>
        <InsightsOverview isHomePage />
      </Content>
    </>
  );
}
