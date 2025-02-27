'use client'

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
  } from "@heroui/table";
  import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
  } from "@heroui/dropdown";
  import {Button} from "@heroui/button";
  // import Link from "next/link";
  import { VerticalDotsIcon } from '@/components/icons/verticalDotsIcon';

  import { Pagination } from "@heroui/pagination";
  import {CompanyDto} from "@/app/db/company";
  
  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "createdYear",
      label: "CREATED YEAR",
    },
    {
      key: "action",
      label: "",
    },
  ];

  type Props = {
    list: CompanyDto[],
    onChangePage: (page: number) => void,
    totalPages: number,
    page: number
  }

  export default function TableComponent({list, onChangePage, totalPages, page}: Props) {
    return (<>
      <Table aria-label="Example table with dynamic content"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={totalPages}
            onChange={(page) => onChangePage(page)}
          />
        </div>
      }
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={list} className='text-black'>
          {(item) => (
            <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="text-black">
                {columnKey === "action" ? (
                  <div className="relative flex justify-end items-center gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <VerticalDotsIcon className="text-default-300" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="solid" className='text-black'>
                      <DropdownItem key="view" className='text-black' href={`/catalog/${item.id}`}>
                        View
                      </DropdownItem>
                      <DropdownItem key="edit">Edit</DropdownItem>
                      <DropdownItem key="delete">Delete</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                ) : (
                  getKeyValue(item, columnKey) // Для остальных столбцов отображаем обычные данные
                )}
              </TableCell>
            )}
          </TableRow>
          )}
        </TableBody>
      </Table>
      </>
    );
  }
