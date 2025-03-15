"use client"

import TableComponent from "@/components/TableComponent";
import {CompanyDto} from "@/db/company";
import {usePathname, useSearchParams, useRouter} from "next/navigation";
import { useState } from 'react';
import ModalComponent from "@/components/ModalComponent";
import CompanyForm from "@/components/CompanyForm";
import { Button } from '@heroui/button';
import { PlusIcon } from '@/components/icons/plusIcon';

type Props = {
    companies: CompanyDto[];
    totalCount: number;
}

export default function CompanyList({companies, totalCount}: Props){
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyDto|null>();

    const openCompanyForm = (company: CompanyDto | null) => {
      setSelectedCompany(company);
      setIsOpen(true);
    };

    const queryParams = useSearchParams();

    const page = queryParams.get("page")
        ? Number(queryParams.get("page"))
        : 1

    const itemsPerPage = queryParams.get("itemsPerPage")
        ? Number(queryParams.get("itemsPerPage"))
        : 5

    const router = useRouter()
    const pathname = usePathname()

    const changePage = (page: number)=>{
        const searchParams = queryParams ?
            new URLSearchParams(queryParams.toString()) :
            new URLSearchParams()

        searchParams.set("page", String(page))
        router.push(pathname + "?" + searchParams.toString());
    }

    return (<>
        <ModalComponent isOpen={isOpen} onOpenChange={setIsOpen} title={selectedCompany ? 'Редактирование компании' : 'Добавление компании'}>
            <CompanyForm company={selectedCompany} />
        </ModalComponent>

        <Button onPress={() => openCompanyForm(null)} color='secondary' className='mb-5'>
            Добавить компанию
            <PlusIcon/>
        </Button>
        <TableComponent openEditModal={openCompanyForm} list={companies} onChangePage={changePage} totalPages={Math.ceil(totalCount/itemsPerPage)} page={page}/>
    </>)
}