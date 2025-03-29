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
import Link from "next/link";
import { Pagination } from "@heroui/pagination";

import { VerticalDotsIcon } from '@/components/icons/verticalDotsIcon';
import {CompanyDto} from "@/db/company";


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
        key: "logoPath",
        label: "LOGO",
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
    page: number,
    openEditModal: (company: CompanyDto) => void
  }

export default function TableComponent({list, onChangePage, totalPages, page, openEditModal}: Props) {
    return (<Table aria-label="Example table with dynamic content"
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
                                                <VerticalDotsIcon className="text-black" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu variant="solid" className='text-black'>
                                            <DropdownItem key="view" className='text-black'>
                                                <Link className='text-black font-normal text-sm w-full block' href={`/catalog/${item.id}`}>show</Link>
                                            </DropdownItem>
                                            <DropdownItem onPress={() => openEditModal(item)} key="edit">Edit</DropdownItem>
                                            <DropdownItem key="delete">Delete</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>

                            ) : (
                                <>
                                    {getKeyValue(item, columnKey)}
                                </>
                            )}
                        </TableCell>
                    )}
                </TableRow>
            )}
        </TableBody>
    </Table>
    );
}
