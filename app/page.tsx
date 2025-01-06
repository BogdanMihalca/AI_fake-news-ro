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
  const { result, ready, blackboxify, reset } = useBlackBoxMagic();
  console.log("result/ready-------------------->", result, ready);

  const handleOnSubmit = (data: FormSchemaType) => {
    const type = data.type === "free_text" ? "text" : "url";
    const text = type === "text" ? data.text : data.web_address;
    blackboxify(text || "", type);
  };

  return (
    <>
      <PageHeader title="Ai fake news detection" />
      {/* to columns one of 1/2 and one of 2/3  */}
      <div className="md:flex md:justify-start">
        <BlackBoxForm handleOnSubmit={handleOnSubmit} reset={reset} />

        <BlackboxResults result={result} ready={ready} />
      </div>

      <Content>
        <Separator className="my-10" />
        <h2 className="text-xl font-bold mb-4">Dataset Statistics</h2>
        <div className="my-4 text-sm text-muted-foreground">
          The training of this AI model used a dataset composed of news articles
          collected from the platform{" "}
          <Link
            href="https://veridica.ro"
            className="underline"
            target="_blank"
          >
            Veridica
          </Link>
          , a source that monitors and identifies fake news and misinformation,
          in combination with the open-source dataset{" "}
          <Link
            href="https://huggingface.co/datasets/mateiaass/FakeRom"
            className="underline"
            target="_blank"
          >
            FakeRom
          </Link>
          {". "}
          The resulting dataset contains varied information, with each article
          being associated with a specific tag indicating its content type. This
          dataset was used to train a fake news classification model, which is
          used to generate the results above.
        </div>
        <InsightsOverview isHomePage />
      </Content>
    </>
  );
}
