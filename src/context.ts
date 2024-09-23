import { PrismaClient } from "@prisma/client";

export type DataSourceContext = {
  dataSources: {
    prisma: PrismaClient;
  }
}