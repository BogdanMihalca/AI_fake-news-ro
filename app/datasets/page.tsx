"use client";

import Content from "@/components/commonPages/Content";
import PageHeader from "@/components/commonPages/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import ChooseFilesFrom from "../../components/dataset/ChooseFilesForm";
import DataTable from "@/components/common/DataTable/DataTable";
import { getColumns } from "../../components/dataset/dataTableColumns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import "./page.scss";
import { omit, set } from "lodash";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import InsightsOverview from "../../components/common/InsightsOverview";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateEditItemDialog } from "@/components/dataset/CreateEditItemDialog";
import { DataSetItem } from "@prisma/client";

const TaggingPage = () => {
  const [dataset, setDataset] = useState<any[]>([]);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [fileObjects, setFileObjects] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>();

  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { toast } = useToast();

  const { data: session, status } = useSession();

  const fetchDataset = useCallback(async () => {
    setIsLoadingData(true);
    const dataset = await fetch("/api/datasets", { cache: "no-cache" }).then(
      (res) => {
        return res.json();
      }
    );

    setDataset(
      dataset.map((item: any, i: number) => ({
        id: item.id,
        displayId: i + 1,
        ...omit(item, ["createdBy", "updatedBy", "createdAt", "updatedAt"]),
      }))
    );
    setIsLoadingData(false);
  }, []);

  useEffect(() => {
    fetchDataset();
  }, [fetchDataset]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    dataset.forEach((item) => {
      tags.add(item.tag);
    });
    return Array.from(tags);
  }, [dataset]);

  const onFilesSelected = (files: any) => {
    if (!files) return;
    setIsLoading(true);
    // each file is a json file with array of objects
    setFileObjects([]);
    setNumberOfFiles(files.length);

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result || "";
        const fileObject = JSON.parse(result as string);
        setFileObjects((prev) => [...prev, ...fileObject]);
      };
      reader.readAsText(file as unknown as Blob);
    }
    setIsLoading(false);
  };

  // charts
  // Assuming data is your array of objects

  const handleCommitToDB = () => {
    //first we get all the unique keys
    const allKeys = new Set<string>();
    fileObjects.forEach((obj) => {
      for (const key in obj) {
        allKeys.add(key);
      }
    });

    //then we normalize the data
    const normalizedData = fileObjects.map((obj) => {
      const newObj: any = {};
      allKeys.forEach((key) => {
        newObj[key] = (obj as any)[key] || "";
      });
      return newObj;
    });

    fetch("/api/datasets", {
      method: "POST",
      body: JSON.stringify({
        datasetItems: normalizedData,
      }),
    })
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(r.statusText);
        }
        fetchDataset();

        toast({
          title: "Data Saved Successfully",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Data Save Failed",
          description: error.message,
          variant: "destructive",
        });
      });

    setShowAlert(false);
  };

  const handleDeleteItem = () => {
    fetch(`/api/datasets?id=${selectedItem}`, {
      method: "DELETE",
    })
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(r.statusText);
        }
        setDataset(dataset.filter((item) => item.id !== selectedItem));
        toast({
          title: "Data Deleted Successfully",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Data Delete Failed",
          description: error.message,
          variant: "destructive",
        });
      });

    setShowAlertDelete(false);
    setSelectedItem(null);
  };

  const onUpdatedTag = useCallback(
    (id: number, tag: string) => {
      const dataItem = dataset.find((item) => item.id === id);
      if (!dataItem) return;
      fetch(`/api/datasets`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          tag,
          content: dataItem.content,
        }),
      })
        .then(async (r) => {
          if (!r.ok) {
            throw new Error(r.statusText);
          }
          setDataset((prev) =>
            prev.map((item) => {
              if (item.id === id) {
                return set(item, "tag", tag);
              }
              return item;
            })
          );
          toast({
            title: "Data Updated Successfully",
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: "Data Update Failed",
            description: error.message,
            variant: "destructive",
          });
        });
    },
    [dataset, toast]
  );

  const onEdit = (id: number) => {
    setSelectedItem(id);
    setIsOpenEdit(true);
  };

  const handleSave = (el: DataSetItem) => {
    if (!el) return;
    fetch(`/api/datasets`, {
      method: "PUT",
      body: JSON.stringify(el),
    })
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(r.statusText);
        }
        fetchDataset();
        toast({
          title: "Data Updated Successfully",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Data Update Failed",
          description: error.message,
          variant: "destructive",
        });
      });
    setIsOpenEdit(false);
    setSelectedItem(null);
  };

  const columns = useMemo(
    () =>
      getColumns({
        data: dataset[0],
        isAuth: (!!session?.user && status === "authenticated") || false,
        hasPermission: (session?.user as any)?.role === "ADMIN" || false,
        onDelete: (e: number) => {
          setShowAlertDelete(true);
          setSelectedItem(e);
        },
        onUpdated: onUpdatedTag,
        onEdit,
        availableTags,
      }),
    [availableTags, dataset, onUpdatedTag, session?.user, status]
  );

  return (
    <>
      <PageHeader title="Data Visualizer" />
      <Content>
        <Suspense
          fallback={
            <div className="w-full">
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-20 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-28 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-20 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-20 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-32 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
              <Skeleton className="h-8 m-4" />
            </div>
          }
        >
          <ChooseFilesFrom
            onFilesSelected={onFilesSelected}
            onCommit={() => setShowAlert(true)}
            isLoading={isLoading}
            numberOfFiles={numberOfFiles}
            numberOfObjects={fileObjects.length}
          />

          <div className="grid gap-4 grid-cols-8 mt-5 taggingPage">
            <Card className="col-span-6">
              <CardHeader>
                <CardTitle>Data</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoadingData ? (
                  // a table skeleton
                  <div className="w-full">
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-20 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-28 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-20 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-20 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-32 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                    <Skeleton className="h-8 m-4" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={(dataset as any[]) || []}
                  />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <InsightsOverview />
              </CardContent>
            </Card>
          </div>
        </Suspense>
      </Content>

      <AlertDialog open={showAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you 100% sure you want to do this?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All records in the database will be
              permanently deleted and replaced with the data from the selected
              files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCommitToDB}>
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAlertDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you 100% sure you want to do this?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The record will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlertDelete(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="
        bg-red-500
        hover:bg-red-700
        text-white
        "
              onClick={handleDeleteItem}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isOpenEdit && (
        <CreateEditItemDialog
          onClose={() => setIsOpenEdit(false)}
          onSave={(e) => {
            handleSave(e);
          }}
          item={dataset.find((item) => item.id === selectedItem)}
          availableTags={availableTags}
        />
      )}
    </>
  );
};
export default TaggingPage;
