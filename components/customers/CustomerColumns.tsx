"use client";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<CustomerType>[] = [
  {
    accessorKey: "clerkId",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Tên người mua",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
