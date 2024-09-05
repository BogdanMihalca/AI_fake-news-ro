"use client";

import Content from "@/components/commonPages/Content";
import PageHeader from "@/components/commonPages/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import metrics from "./results_alll_merged.json";
import { map, reduce } from "lodash";
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const DocsPage = () => {
  const tabsList = [
    {
      title: "Introducere",
      value: "introducere",
    },
    {
      title: "Modele IA",
      value: "modele_ia",
    },
    {
      title: "Evaluare",
      value: "evaluare",
    },
  ];

  const getValidTab = (tab: string) => {
    if (tabsList.some((t) => t.value === tab)) {
      return tab;
    }
    return tabsList[0].value;
  };

  const hashPath = window.location.hash;

  const [activeTab, setActiveTab] = useState(
    getValidTab(hashPath.replace("#", ""))
  );

  const data = map(metrics, (metric, i) => ({
    label: metric.Model,
    accuracy: metric.Accuracy,
    precision: metric.Precision,
    recall: metric.Recall,
    f1: metric["F1 Score"],
    fill: `hsl(var(--chart-${i + 1}))`,
  }));

  // for each metric in the roc auc data, get its value for each model
  // {
  //   label: "class"
  //   "model1": 0.5,
  //     "model2": 0.6,
  //       "model3": 0.7,
  //         "model4": 0.8,
  //           "model5": 0.9,
  //             "model6": 0.95,
  // }
  const dataROC = reduce(
    metrics,
    (acc: any[], { Model, "ROC AUC Per Class": rocAucPerClass }: any) => {
      Object.keys(rocAucPerClass).forEach((metric) => {
        const existingMetric = acc.find((item) => item.label === metric);
        if (existingMetric) {
          existingMetric[Model] = rocAucPerClass[metric] || 0;
        } else {
          acc.push({
            label: metric,
            [Model]: rocAucPerClass[metric] || 0,
          });
        }
      });
      return acc;
    },
    []
  );

  const rocChartConfig: ChartConfig = reduce(
    metrics,
    (acc, { Model }, i) => {
      acc[Model] = {
        label: Model,
        color: `hsl(var(--chart-${i + 1}))`,
      };
      return acc;
    },
    {} as any
  );

  const chartConfig: ChartConfig = {
    "Naive Bayes": {
      label: "Naive Bayes",
    },
    "Logistic Regression": {
      label: "Logistic Regression",
    },
    "Support Vector Machine": {
      label: "Support Vector Machine",
    },
    BERT: {
      label: "BERT",
    },
    "BERT Enhanced": {
      label: "BERT Enhanced",
    },
    "RoBERTa-large": {
      label: "RoBERTa-large",
    },
  };

  return (
    <>
      <PageHeader title="Informatii generale" />

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

          <TabsContent
            value={tabsList[0].value}
            className="w-full min-h-[75vh]"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{tabsList[0].title}</CardTitle>
                <CardDescription>
                  Acest studiu își propune să compare diverse modele de
                  inteligență artificială pentru detectarea știrilor false
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  În ultimii ani, fenomenul știrilor false a devenit o problemă
                  majoră în România și în întreaga lume. Știrile false,
                  cunoscute și sub denumirea de &quot;fake news&quot;, sunt
                  create cu scopul de a dezinforma și de a manipula opinia
                  publică. Acestea pot avea consecințe grave, de la influențarea
                  rezultatelor electorale până la amplificarea panicii în rândul
                  populației, cum a fost cazul pandemiei de COVID-19.
                </p>
                <p className="text-sm">
                  În acest context, detectarea automată a știrilor false devine
                  o necesitate. Modelele de inteligență artificială (AI) au fost
                  antrenate pentru a recunoaște diferite tipuri de informații și
                  pentru a diferenția între știrile autentice și cele false.
                  Scopul acestui studiu este de a compara eficiența diferitelor
                  modele AI în detectarea tipurilor de știri false și de a
                  prezenta rezultatele acestor evaluări.
                </p>
                <div className="mt-8 block w-full h-10" />
                <h2 className="font-bold text-muted-foreground">
                  Categorii de stiri false
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  În cadrul acestui studiu, au fost identificate și clasificate
                  mai multe tipuri de știri false. Apasă pe fiecare categorie
                  pentru mai multe detalii:
                </p>
                <Accordion
                  type="single"
                  className="w-3/4 bg-slate-700/10 p-5 rounded-md shadow-md shadow-accent mt-10"
                >
                  <AccordionItem value="fake-news">
                    <AccordionTrigger>Fake News</AccordionTrigger>
                    <AccordionContent>
                      Fake news reprezintă știri complet inventate, fără nicio
                      bază factuală, create cu intenția de a induce în eroare și
                      manipula opinia publică. Acestea sunt utilizate pentru a
                      răspândi informații false și pentru a crea panică sau
                      dezinformare.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="misinformation">
                    <AccordionTrigger>Misinformation</AccordionTrigger>
                    <AccordionContent>
                      Misinformation se referă la informații false sau inexacte,
                      dar care sunt răspândite fără intenția deliberată de a
                      dezinforma. Aceasta apare adesea din cauza lipsei
                      verificării sursei sau a partajării neintenționate a
                      informațiilor eronate.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="propaganda">
                    <AccordionTrigger>Propaganda</AccordionTrigger>
                    <AccordionContent>
                      Propaganda include informații răspândite în mod
                      intenționat pentru a influența opinia publică sau pentru a
                      promova o anumită agendă politică, socială sau ideologică.
                      Aceasta este adesea folosită pentru a controla percepția
                      publicului și poate conține distorsiuni ale adevărului.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="real-news">
                    <AccordionTrigger>Real News</AccordionTrigger>
                    <AccordionContent>
                      Real news se referă la știri autentice, bazate pe fapte și
                      informații verificate, raportate de surse de încredere.
                      Este important ca modelele AI să poată distinge aceste
                      știri de știrile false.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="satire">
                    <AccordionTrigger>Satire</AccordionTrigger>
                    <AccordionContent>
                      Satira este o formă de umor care folosește exagerarea și
                      parodia pentru a critica evenimentele sau persoanele
                      publice. Deși satira nu este creată cu intenția de a
                      dezinforma, uneori poate fi confundată cu știri reale de
                      către publicul larg.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value={tabsList[1].value}
            className="w-full min-h-[75vh] "
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{tabsList[1].title}</CardTitle>
                <CardDescription>
                  În cadrul acestui studiu, au fost comparate urmatoarele modele
                  de inteligență artificială pentru detectarea știrilor false.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-sm text-gray-200">
                  În acest studiu, au fost utilizate mai multe{" "}
                  <span className="text-blue-300 font-semibold">
                    modele de inteligență artificială
                  </span>
                  pentru a detecta știrile false. Fiecare model are
                  caracteristici unice și contribuie în mod diferit la
                  clasificarea corectă a textelor. Iată detalii despre modelele
                  utilizate:
                </p>
                {/* Naive Bayes */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-red-500 mb-4">
                    Naive Bayes
                  </h3>
                  <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
                    <Image
                      src="/nayve.png"
                      alt="Naive Bayes"
                      className="block mb-8 lg:mb-0 lg:mr-8"
                      width={600}
                      height={400}
                    />
                    <div>
                      <p className="mt-4">
                        <strong>Naive Bayes</strong> este un algoritm simplu,
                        dar eficient, bazat pe{" "}
                        <span className="text-blue-300 font-medium">
                          teorema lui Bayes
                        </span>
                        . Se folosește de presupunerea că fiecare atribut
                        (cuvânt) dintr-un text este{" "}
                        <span className="font-semibold">independent</span>, ceea
                        ce îl face rapid și eficient pentru clasificarea
                        textelor mari.
                      </p>
                      <p className="mt-4">
                        În ciuda simplității sale, Naive Bayes este des utilizat
                        în sarcini de clasificare a textului și se comportă
                        surprinzător de bine pentru sarcini de clasificare
                        binară sau multiclasa.
                        <a
                          href="https://en.wikipedia.org/wiki/Naive_Bayes_classifier"
                          className="text-blue-300 hover:underline ml-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Află mai multe
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
                <Separator orientation="horizontal" className="mt-8 mb-8" />
                {/* Logistic Regression */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-red-500 mb-4">
                    Logistic Regression
                  </h3>
                  <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
                    <Image
                      src="/logisitc.png"
                      alt="Logistic Regression"
                      className="block mb-8 lg:mb-0 lg:mr-8"
                      width={300}
                      height={300}
                    />
                    <div>
                      <p className="mt-4">
                        <strong>Logistic Regression</strong> este un model de{" "}
                        <span className="text-blue-300 font-medium">
                          clasificare liniară
                        </span>
                        , utilizat pentru probleme de clasificare binară. Acesta
                        modelează probabilitatea ca o observație să aparțină
                        unei clase și este eficient în sarcini de clasificare
                        simple.
                      </p>
                      <p>
                        În ciuda simplității sale, Logistic Regression poate
                        produce rezultate impresionante, mai ales în combinație
                        cu alte tehnici de preprocesare a textului.
                        <a
                          href="https://en.wikipedia.org/wiki/Logistic_regression"
                          className="text-blue-300 hover:underline ml-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Află mai multe
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
                <Separator orientation="horizontal" className="mt-8 mb-8" />
                {/*Support vector machine */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-red-500 mb-4">
                    Support Vector Machine (SVM)
                  </h3>
                  <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
                    <Image
                      src="/svm.webp"
                      alt="Support Vector Machine"
                      className="block mb-8 lg:mb-0 lg:mr-8"
                      width={300}
                      height={300}
                    />
                    <div>
                      <p className="mt-4">
                        <strong>Support Vector Machine (SVM)</strong> este un
                        algoritm de{" "}
                        <span className="text-blue-300 font-medium">
                          clasificare
                        </span>{" "}
                        care funcționează prin separarea datelor cu ajutorul
                        unei hiperplane. SVM este foarte eficient în
                        clasificarea datelor complexe și este des folosit în
                        sarcini unde clasele sunt greu de separat.
                      </p>
                      <p>
                        SVM funcționează bine cu seturi mari de date și poate fi
                        utilizat pentru a separa eficient știrile false de cele
                        reale.
                        <a
                          href="https://en.wikipedia.org/wiki/Support_vector_machine"
                          className="text-blue-300 hover:underline ml-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Află mai multe
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                <Separator orientation="horizontal" className="mt-8 mb-8" />
                {/* BERT */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-red-500 mb-4">
                    BERT (Bidirectional Encoder Representations from
                    Transformers)
                  </h3>
                  <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
                    <Image
                      src="/bert.png"
                      alt="BERT"
                      className="block mb-8 lg:mb-0 lg:mr-8"
                      width={400}
                      height={300}
                    />
                    <div>
                      <p className="mt-4">
                        <strong>BERT</strong> este un model avansat de{" "}
                        <span className="text-blue-300 font-medium">
                          prelucrare a limbajului natural
                        </span>
                        , dezvoltat de Google. Acesta este un model de tip
                        Transformer care înțelege contextul bidirecțional al
                        cuvintelor dintr-o propoziție, ceea ce îl face extrem de
                        puternic în sarcini de clasificare a textului.
                      </p>
                      <p>
                        BERT este folosit pe scară largă în detecția știrilor
                        false datorită capacității sale de a captura
                        subtilitățile și contextul limbajului.
                        <a
                          href="https://en.wikipedia.org/wiki/BERT_(language_model)"
                          className="text-blue-300 hover:underline ml-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Află mai multe
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
                <Separator orientation="horizontal" className="mt-8 mb-8" />
                {/* RoERTa Large */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-red-500 mb-4">
                    RoBERTa-large
                  </h3>
                  <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
                    <Image
                      src="/roberta.png"
                      alt="RoBERTa-large"
                      className="block mb-8 lg:mb-0 lg:mr-8"
                      width={600}
                      height={300}
                    />
                    <div>
                      <p className="mt-4">
                        <strong>RoBERTa-large</strong> este o versiune
                        optimizată a modelului{" "}
                        <span className="text-blue-300 font-medium">BERT</span>,
                        dezvoltată de Facebook AI. RoBERTa-large este antrenat
                        pe mai multe date și are setări de hiperparametri
                        ajustate pentru o performanță mai bună în sarcinile de
                        clasificare.
                      </p>
                      <p>
                        Acest model s-a dovedit extrem de eficient în detectarea
                        știrilor false, fiind capabil să captureze relațiile
                        semantice complexe dintre cuvinte.
                        <a
                          href="https://en.wikipedia.org/wiki/RoBERTa"
                          className="text-blue-300 hover:underline ml-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Află mai multe
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value={tabsList[2].value}
            className="w-full min-h-[75vh]"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{tabsList[2].title}</CardTitle>
                <CardDescription>
                  În această secțiune, sunt prezentate rezultatele evaluării
                  modelelor de inteligență artificială pentru detectarea
                  știrilor false.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <section
                  id="metrics-definition"
                  className="mb-16 px-6 py-10 bg-gray-800 rounded-lg shadow-lg"
                >
                  <h2 className="text-xl font-bold text-gray-200 mb-8 text-center">
                    Metrici de Evaluare a Modelelor
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Accuracy */}
                    <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-blue-400 mb-4">
                          Acuratetea
                        </h3>
                        <p className="text-gray-300 text-sm">
                          <strong>Acuratetea</strong> măsoară proporția totală
                          de predicții corecte (atât pozitive cât și negative)
                          față de toate predicțiile.
                        </p>
                      </div>
                      <div>
                        Formula este:
                        <p className="mt-4 text-gray-500 italic text-xs font-mono bg-neutral-900 rounded-md p-4">
                          Acuratetea = (TP + TN) / (TP + TN + FP + FN)
                        </p>
                      </div>
                    </div>

                    {/* Precision */}
                    <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-green-400 mb-4">
                          Precizia
                        </h3>
                        <p className="text-gray-300 text-sm">
                          <strong>Precizia</strong> este proporția de exemple
                          relevante (adevărate pozitive) dintre toate exemplele
                          etichetate ca pozitive (predicții pozitive).
                        </p>
                      </div>
                      <div>
                        Formula este:
                        <p className="mt-4 text-gray-500 italic text-xs font-mono bg-neutral-900 rounded-md p-4">
                          Precizia = TP / (TP + FP)
                        </p>
                      </div>
                    </div>

                    {/* Recall */}
                    <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-red-400 mb-4">
                          Recall
                        </h3>
                        <p className="text-gray-300 text-sm">
                          <strong>Recall</strong> măsoară proporția de exemple
                          pozitive identificate corect dintre toate exemplele
                          pozitive reale.
                        </p>
                      </div>
                      <div>
                        Formula este:
                        <p className="mt-4 text-gray-500 italic text-xs font-mono bg-neutral-900 rounded-md p-4">
                          Recall = TP / (TP + FN)
                        </p>
                      </div>
                    </div>

                    {/* F1 Score */}
                    <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-purple-400 mb-4">
                          F1 Score
                        </h3>
                        <p className="text-gray-300 text-sm">
                          <strong>F1 Score</strong> este media armonică dintre
                          Precizia și recall. Este util atunci când trebuie să
                          se țină cont atât de erorile false pozitive, cât și de
                          cele false negative.
                        </p>
                      </div>
                      <div className="mt-10">
                        Formula este:
                        <p className="mt-4 text-gray-500 italic text-xs font-mono bg-neutral-900 rounded-md p-4">
                          F1 Score = 2 * (Precizia * Recall) / (Precizia +
                          Recall)
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
                <Separator orientation="horizontal" className="mt-4 mb-4" />
                <section className="mb-16 px-6 py-10 bg-gray-800 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold text-blue-500 mb-8 text-center">
                    Rezultatele Evaluarii
                  </h2>
                  <p className="text-sm text-gray-200 mb-4 text">
                    ** Toate modele au fost antrenate pe același set de date și
                    au fost evaluate folosind aceleași metrici.
                  </p>
                  <p className="text-sm text-gray-200 mb-4">
                    ** Singura exceptie este modelul{" "}
                    <span className="font-extrabold">Bert Enhanced</span> care
                    este acelasi model folosit in aplicatia noastra.
                    <br></br>
                    La baza sa se regasteste acelasi model Bert, insa s-au
                    aplicat tehnici de preprocesare a textului mai avansate, si
                    hiperparametrii optimizati, obtinand astfel rezultate mult
                    mai superioare.
                  </p>
                  <p className="text-sm text-gray-200 mb-4">
                    ** Modelul aflat la baza lui{" "}
                    <span className="font-extrabold">BERT</span> si{" "}
                    <span className="font-extrabold">Bert Enhanced</span>
                    este modelul `bert-base-uncased` de la Hugging Face. Acesta
                    vine pre-antrenat pe un set de date de dimensiune mare si
                    este optimizat pentru sarcini de clasificare a textului.
                  </p>
                  <p className="text-sm text-gray-200 mb-8">
                    ** Acuratetea, precizia, recall-ul si F1 Score-ul sunt
                    masurate in procente.
                  </p>

                  <div className="grid grid-cols-1  lg:grid-cols-2 gap-8">
                    {/* Accuracy */}

                    <Card>
                      <CardHeader>
                        <CardTitle>Acuratetea</CardTitle>
                        <CardDescription className="text-xs">
                          Acesta reprezinta procentul de exemple corect
                          clasificate de model. Spre exemplu, un model cu o
                          acuratete de 100% inseamna ca a clasificat corect
                          toate stirile testate.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig}>
                          <BarChart accessibilityLayer data={data}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="label"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                              tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]
                                  ?.label as string
                              }
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tickMargin={10}
                              tickFormatter={(value) => `${value * 100}%`}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={
                                <ChartTooltipContent
                                  valueFormatter={(value) =>
                                    `${(value * 100).toFixed(2)}%`
                                  }
                                />
                              }
                            />
                            <Bar
                              dataKey="accuracy"
                              strokeWidth={2}
                              radius={8}
                              activeIndex={5}
                              activeBar={({ ...props }) => {
                                return (
                                  <Rectangle
                                    {...props}
                                    fillOpacity={0.8}
                                    stroke={props.payload.fill}
                                    strokeDasharray={4}
                                    strokeDashoffset={4}
                                  />
                                );
                              }}
                            >
                              <LabelList
                                dataKey="accuracy"
                                position="top"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value: number) =>
                                  `${(value * 100).toFixed(2)}%`
                                }
                              />
                            </Bar>
                          </BarChart>
                        </ChartContainer>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium">
                          Acuratetea cea mai buna o are{" "}
                          {
                            data.reduce((acc, curr) => {
                              return acc.accuracy > curr.accuracy ? acc : curr;
                            }).label
                          }
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex gap-2 font-sm text-muted-foreground ">
                          Acuratetea cea mai slaba o are{" "}
                          {
                            data.reduce((acc, curr) => {
                              return acc.accuracy < curr.accuracy ? acc : curr;
                            }).label
                          }
                          <TrendingDown className="h-4 w-4" />
                        </div>

                        <div className="text-muted-foreground">
                          ceea ce indică faptul că acesta nu este optim pentru
                          detectarea știrilor false în acest set de date.
                        </div>
                      </CardFooter>
                    </Card>

                    {/* Precision */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Precizia</CardTitle>
                        <CardDescription className="text-xs">
                          Precizia reprezinta procentul de exemple relevante
                          (adevarate pozitive) dintre toate exemplele etichetate
                          ca pozitive (predicții pozitive).
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig}>
                          <BarChart accessibilityLayer data={data}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="label"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                              tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]
                                  ?.label as string
                              }
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tickMargin={10}
                              tickFormatter={(value) => `${value * 100}%`}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={
                                <ChartTooltipContent
                                  valueFormatter={(value) =>
                                    `${(value * 100).toFixed(2)}%`
                                  }
                                />
                              }
                            />
                            <Bar
                              dataKey="precision"
                              strokeWidth={2}
                              radius={8}
                              activeIndex={5}
                              activeBar={({ ...props }) => {
                                return (
                                  <Rectangle
                                    {...props}
                                    fillOpacity={0.8}
                                    stroke={props.payload.fill}
                                    strokeDasharray={4}
                                    strokeDashoffset={4}
                                  />
                                );
                              }}
                            >
                              <LabelList
                                dataKey="precision"
                                position="top"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value: number) =>
                                  `${(value * 100).toFixed(2)}%`
                                }
                              />
                            </Bar>
                          </BarChart>
                        </ChartContainer>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium">
                          Acuratetea cea mai buna o are{" "}
                          {
                            data.reduce((acc, curr) => {
                              return acc.accuracy > curr.accuracy ? acc : curr;
                            }).label
                          }
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground">
                          <PieChart className="h-4 w-4 inline-block" /> Deși
                          RoBERTa-large oferă o precizie bună, nu este la fel de
                          ridicată ca alte modele, ceea ce poate însemna că,
                          deși este destul de precis, face mai multe erori de
                          tip fals pozitiv decât BERT sau SVM.
                        </div>
                        <div className="text-muted-foreground">
                          <PieChart className="h-4 w-4 inline-block" /> Modelul
                          BERT are o precizie bună, ceea ce arată că poate face
                          o distincție solidă între știrile reale și cele false,
                          minimizând numărul de știri reale etichetate greșit.
                        </div>
                      </CardFooter>
                    </Card>

                    {/* Recall */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recall</CardTitle>
                        <CardDescription>
                          Recall-ul măsoară proporția de exemple pozitive
                          identificate corect dintre toate exemplele pozitive
                          reale.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig}>
                          <BarChart
                            accessibilityLayer
                            data={data}
                            layout="vertical"
                            margin={{
                              left: 40,
                            }}
                          >
                            <YAxis
                              dataKey="label"
                              type="category"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                              tickFormatter={(value: string) =>
                                chartConfig[value as keyof typeof chartConfig]
                                  ?.label as string
                              }
                            />
                            <XAxis dataKey="recall" type="number" hide />
                            <ChartTooltip
                              cursor={false}
                              content={
                                <ChartTooltipContent
                                  hideLabel
                                  valueFormatter={(value) =>
                                    `${(value * 100).toFixed(2)}%`
                                  }
                                />
                              }
                            />
                            <Bar dataKey="recall" layout="vertical" radius={5}>
                              <LabelList
                                dataKey="recall"
                                position="insideRight"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value: number) =>
                                  `${(value * 100).toFixed(2)}%`
                                }
                              />
                            </Bar>
                          </BarChart>
                        </ChartContainer>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium">
                          Recall-ul cel mai bun il are{" "}
                          {
                            data.reduce((acc, curr) => {
                              return acc.recall > curr.recall ? acc : curr;
                            }).label
                          }
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground">
                          <PieChart className="h-4 w-4 inline-block" /> SVM
                          prezintă un recall ridicat, ceea ce arată că acest
                          model poate identifica corect majoritatea știrilor
                          false, fiind eficient în captarea exemplelor
                          relevante.
                        </div>
                        <div className="text-muted-foreground">
                          <PieChart className="h-4 w-4 inline-block" /> Modelul
                          BERT are cel mai bun recall dintre modele, fiind
                          capabil să recunoască un procent mare de știri false,
                          chiar și cele cu nuanțe subtile, demonstrând o
                          capacitate foarte bună de a capta exemplele pozitive
                          reale.
                        </div>
                      </CardFooter>
                    </Card>

                    {/* F1 Score */}
                    <Card>
                      <CardHeader>
                        <CardTitle>F1 Score</CardTitle>
                        <CardDescription>
                          F1 Score-ul este media armonică dintre Precizia și
                          recall. Este util atunci când trebuie să se țină cont
                          atât de erorile false pozitive, cât și de cele false
                          negative.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig}>
                          <BarChart
                            accessibilityLayer
                            data={data}
                            layout="vertical"
                            margin={{
                              left: 40,
                            }}
                          >
                            <YAxis
                              dataKey="label"
                              type="category"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                              tickFormatter={(value: string) =>
                                chartConfig[value as keyof typeof chartConfig]
                                  ?.label as string
                              }
                            />
                            <XAxis dataKey="f1" type="number" hide />
                            <ChartTooltip
                              cursor={false}
                              content={
                                <ChartTooltipContent
                                  hideLabel
                                  valueFormatter={(value) =>
                                    `${(value * 100).toFixed(2)}%`
                                  }
                                />
                              }
                            />
                            <Bar dataKey="f1" layout="vertical" radius={5}>
                              <LabelList
                                dataKey="recall"
                                position="insideRight"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value: number) =>
                                  `${(value * 100).toFixed(2)}%`
                                }
                              />
                            </Bar>
                          </BarChart>
                        </ChartContainer>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium">
                          F1 Score-ul cel mai bun il are{" "}
                          {
                            data.reduce((acc, curr) => {
                              return acc.f1 > curr.f1 ? acc : curr;
                            }).label
                          }
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground">
                          <PieChart className="h-4 w-4 inline-block" /> F1 Score
                          pentru Naive Bayes este cel mai scăzut, ceea ce
                          sugerează că modelul face compromisuri majore între
                          precizie și recall, având o performanță generală slabă
                          în detectarea știrilor false.
                        </div>
                        <div className="text-muted-foreground">
                          <PieChart className="h-4 w-4 inline-block" /> eși
                          RoBERTa-large oferă un F1 Score bun, acesta este mai
                          mic decât cel al modelului BERT, sugerând că, deși
                          modelul funcționează bine, nu este la fel de
                          performant în menținerea echilibrului între precizie
                          și recall.
                        </div>
                      </CardFooter>
                    </Card>

                    {/* ROC auc per class */}
                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle>ROC AUC per Class</CardTitle>
                        <CardDescription>
                          AUC (Area Under the Curve) este o măsură a
                          performanței unui model de clasificare. Cu cât AUC
                          este mai mare, cu atât modelul este mai bun la
                          distingerea între clase.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={rocChartConfig}>
                          <BarChart accessibilityLayer data={dataROC}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="label"
                              tickLine={true}
                              tickMargin={10}
                              axisLine={true}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={
                                <ChartTooltipContent indicator="dashed" />
                              }
                            />
                            <Bar
                              dataKey="Naive Bayes"
                              fill="hsl(var(--chart-1))"
                              radius={8}
                              strokeWidth={2}
                            />

                            <Bar
                              dataKey="Logistic Regression"
                              fill="hsl(var(--chart-2))"
                              radius={8}
                              strokeWidth={2}
                            />
                            <Bar
                              dataKey="Support Vector Machine"
                              fill="hsl(var(--chart-3))"
                              radius={8}
                              strokeWidth={2}
                            />
                            <Bar
                              dataKey="BERT"
                              fill="hsl(var(--chart-4))"
                              radius={8}
                              strokeWidth={2}
                            />
                            <Bar
                              dataKey="RoBERTa-large"
                              fill="hsl(var(--chart-5))"
                              radius={8}
                              strokeWidth={2}
                            />
                            <Bar
                              dataKey="BERT Enhanced"
                              fill="hsl(var(--chart-6))"
                              radius={8}
                              strokeWidth={2}
                            />
                          </BarChart>
                        </ChartContainer>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="text-muted-foreground">
                          <span className="font-semibold text-emerald-500">
                            <PieChart className="h-4 w-4 inline-block mr-2" />
                            General Model Strength:
                          </span>{" "}
                          odelele precum SVM și BERT demonstrează o capacitate
                          constantă de a gestiona diverse forme de informații
                          false, excelând în special în detectarea satirei și a
                          știrilor reale, în timp ce Naive Bayes întâmpină mai
                          multe dificultăți cu clase mai nuanțate, cum ar fi
                          misinformation (dezinformarea).
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-semibold text-fuchsia-500">
                            <PieChart className="h-4 w-4 inline-block mr-2" />
                            Provocarea legată de misinformation:
                          </span>{" "}
                          Misinformation (dezinformarea) pare să fie cea mai
                          dificilă clasă pentru toate modelele, deoarece adesea
                          conține adevăruri parțiale, ceea ce poate confunda
                          modelele tradiționale de învățare automată.
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-semibold text-red-500">
                            <PieChart className="h-4 w-4 inline-block mr-2" />
                            Detectarea satirei:
                          </span>{" "}
                          Toate modelele se descurcă excepțional de bine în
                          detectarea satirei, probabil datorită naturii
                          exagerate a acestei clase, care o face mai ușor de
                          diferențiat de alte tipuri de conținut.
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-semibold text-amber-500">
                            <PieChart className="h-4 w-4 inline-block mr-2" />
                            Fiabilitatea în detectarea știrilor reale:
                          </span>{" "}
                          Toate modelele, în special BERT și SVM, se descurcă
                          extrem de bine în identificarea corectă a știrilor
                          reale, ceea ce arată că aceste modele sunt foarte
                          capabile să distingă conținutul legitim.
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-semibold text-sky-500">
                            <PieChart className="h-4 w-4 inline-block mr-2" />
                            Sensibilitatea la propagandă:
                          </span>{" "}
                          BERT și SVM sunt deosebit de eficiente în
                          identificarea propagandei, sugerând puterea lor în
                          detectarea conținutului manipulator sau părtinitor.
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Content>
    </>
  );
};

export default DocsPage;
