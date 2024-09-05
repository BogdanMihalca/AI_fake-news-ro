import { Skeleton } from "../ui/skeleton";

const BalckboxResultsSkeleton = () => {
  return (
    <div className="border shadow-sm max-w-[500px] rounded-md">
      <div className="p-6 pb-0 pt-4">
        <div className="flex justify-center">
          <Skeleton className="w-[356px] h-[120px] my-4" />
        </div>

        <div className="shrink-0 bg-border h-[1px] w-full mb-4"></div>
        <div className="flex justify-center">
          <Skeleton className="w-[400px] h-[100px] my-4" />
        </div>
      </div>
      <div className="flex items-center p-6 flex-col gap-2 border-t-2 pt-2">
        <Skeleton className="w-full h-[20px] my-5" />
        <Skeleton className="w-full h-[20px]" />
      </div>
    </div>
  );
};

export { BalckboxResultsSkeleton };
