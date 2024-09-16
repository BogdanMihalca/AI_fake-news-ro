import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IntroductionTabProps {
  title: string;
  value: string;
}

const IntroductionTab: React.FC<IntroductionTabProps> = ({ title, value }) => {
  return (
    <TabsContent value={value} className="w-full min-h-[75vh]">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            This study aims to compare various artificial intelligence models
            for detecting fake news.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm">
            In recent years, the phenomenon of fake news has become a major
            problem in Romania and around the world. Fake news, also known as
            &quot;fake news&quot;, is created with the purpose of disinforming
            and manipulating public opinion. These can have serious
            consequences, from influencing election results to amplifying panic
            among the population, as was the case during the COVID-19 pandemic.
          </p>
          <p className="text-sm">
            In this context, the automatic detection of fake news becomes a
            necessity. Artificial intelligence (AI) models have been trained to
            recognize different types of information and to differentiate
            between authentic and fake news. The aim of this study is to compare
            the efficiency of different AI models in detecting types of fake
            news and to present the results of these evaluations.
          </p>
          <div className="mt-8 block w-full h-10" />
          <h2 className="font-bold text-muted-foreground">
            Categories of fake news
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            In this study, several types of fake news have been identified and
            classified. Click on each category for more details:
          </p>
          <Accordion
            type="single"
            className="w-3/4 bg-slate-700/10 p-5 rounded-md shadow-md shadow-accent mt-10"
          >
            <AccordionItem value="fake-news">
              <AccordionTrigger>Fake News</AccordionTrigger>
              <AccordionContent>
                Fake news represents completely invented news, without any
                factual basis, created with the intention of misleading and
                manipulating public opinion. These are used to spread false
                information and to create panic or disinformation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="misinformation">
              <AccordionTrigger>Misinformation</AccordionTrigger>
              <AccordionContent>
                Misinformation refers to false or inaccurate information, but
                which is spread without the deliberate intention to misinform.
                This often occurs due to lack of source verification or
                unintentional sharing of erroneous information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="propaganda">
              <AccordionTrigger>Propaganda</AccordionTrigger>
              <AccordionContent>
                Propaganda includes information intentionally spread to
                influence public opinion or to promote a certain political,
                social, or ideological agenda. It is often used to control
                public perception and may contain distortions of the truth.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="real-news">
              <AccordionTrigger>Real News</AccordionTrigger>
              <AccordionContent>
                Real news refers to authentic news, based on facts and verified
                information, reported by reliable sources. It is important for
                AI models to be able to distinguish these news from fake news.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="satire">
              <AccordionTrigger>Satire</AccordionTrigger>
              <AccordionContent>
                Satire is a form of humor that uses exaggeration and parody to
                criticize public events or figures. Although satire is not
                created with the intention to misinform, it can sometimes be
                mistaken for real news by the general public.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export { IntroductionTab };
