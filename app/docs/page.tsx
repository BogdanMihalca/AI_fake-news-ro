"use client";

import Content from "@/components/commonPages/Content";
import PageHeader from "@/components/commonPages/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IntroductionTab } from "@/components/docs/IntroductionTab";
import { AiModelsTab } from "@/components/docs/AiModelsTab";
import { ResultsTab } from "@/components/docs/ResultsTab";

const DocsPage = () => {
  const tabsList = useMemo(
    () => [
      {
        title: "Intro",
        value: "introducere",
      },
      {
        title: "Ai models",
        value: "modele_ia",
      },
      {
        title: "Evaluation",
        value: "evaluare",
      },
    ],
    []
  );

  const getValidTab = useCallback(
    (tab: string) => {
      if (tabsList.some((t) => t.value === tab)) {
        return tab;
      }
      return tabsList[0].value;
    },
    [tabsList]
  );

  const [activeTab, setActiveTab] = useState(
    getValidTab(window && window.location.hash.replace("#", ""))
  );

  const callbackListener = useCallback(() => {
    const hash = window.location.hash.replace("#", "");
    hash !== activeTab && setActiveTab(getValidTab(hash));
  }, [activeTab, getValidTab]);

  useEffect(() => {
    // set listener for hash change
    window.addEventListener("hashchange", callbackListener);
    return () => {
      window.removeEventListener("hashchange", callbackListener);
    };
  }, [callbackListener]);

  return (
    <>
      <PageHeader title="General Info" />

      <Content>
        <Tabs
          value={activeTab}
          className="w-full flex"
          onValueChange={(value) => {
            window.location.hash = value;
            setActiveTab(value);
          }}
        >
          <TabsList className="flex-col h-auto justify-start pt-20 md:px-2 md:mr-8 bg-slate-700/40">
            {tabsList.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <IntroductionTab
            title={tabsList[0].title}
            value={tabsList[0].value}
          />
          <AiModelsTab title={tabsList[1].title} value={tabsList[1].value} />
          <ResultsTab title={tabsList[2].title} value={tabsList[2].value} />
        </Tabs>
      </Content>
    </>
  );
};

export default DocsPage;
