import Content from "@/components/commonPages/Content";
import PageContainer from "@/components/commonPages/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContainer>
      <Content>
        <div className="flex flex-col align-center justify-center items-center space-y-4 h-screen w-screen">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      </Content>
    </PageContainer>
  );
}
