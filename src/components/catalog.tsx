"use client"

import Table from "@/components/table";
import {CompanyDto} from "@/app/db/company";
import {usePathname, useSearchParams, useRouter} from "next/navigation";
import { useState } from 'react';
import CompanyModal from "@/components/companyModal";
import { Button } from '@heroui/button';
import { PlusIcon } from '@/components/icons/plusIcon';
import {createCompanyAction} from "@/app/actions/company";

type Props = {
    companies: CompanyDto[];
    totalCount: number;
}

export default function CompanyList({companies, totalCount}: Props){
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = (e: boolean) => {
      setIsOpen(e)
    };
    const closeModal = () => setIsOpen(false);
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

    const createCompany = async (payload:{name: string, createdYear: number}) => {
        try {
            await createCompanyAction(payload)
        } catch (error) {
            alert(error)
        }
    }

    return (<>
        <CompanyModal isOpen={isOpen} onOpenChange={toggleModal} closeModal={closeModal} onSubmit={createCompany}/>
        <Button onPress={() => toggleModal(true)} color='secondary' className='mb-5'>
            Добавить компанию
            <PlusIcon/>
        </Button>
        <Table list={companies} onChangePage={changePage} totalPages={Math.ceil(totalCount/itemsPerPage)} page={page}/>
    </>)
}