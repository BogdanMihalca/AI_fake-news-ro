import prisma from "@/lib/prisma";

export const getDatasetItems = async () => {
  const dataset = await prisma.dataSetItem.findMany();
  return dataset;
};

export const updateDatasetItem = async (data: {
  id: number;
  tag: string;
  content: string;
}) => {
  const dataset = await prisma.dataSetItem.update({
    where: { id: data.id },
    data: {
      tag: data.tag,
      content: data.content,
    },
  });
  return dataset;
};

export const deleteDatasetItem = async (id: number) => {
  const dataset = await prisma.dataSetItem.delete({
    where: { id: id },
  });
  return dataset;
};

export const createDatasetItem = async (data: {
  tag: string;
  content: string;
  createdBy: string;
}) => {
  const dataset = await prisma.dataSetItem.create({
    data: {
      tag: data.tag,
      content: data.content,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    },
  });
  return dataset;
};

export const clearDatasetItems = async () => {
  const dataset = await prisma.dataSetItem.deleteMany();
  return dataset;
};

export const insertDatasetItems = async (
  data: {
    tag: string;
    content: string;
  }[],
  user: string
) => {
  const dataProcessed = data.map((item) => {
    return {
      ...item,
      createdBy: user,
      updatedBy: "",
    };
  });

  const dataset = await prisma.dataSetItem.createMany({
    data: dataProcessed,
  });

  return dataset;
};
