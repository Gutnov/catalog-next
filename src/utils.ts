import { writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from 'uuid';
import { Company, CompanyDto } from "@/app/db/company";
import { CompanyFormErrors } from "@/types";

export const saveFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const fileData = Buffer.from(arrayBuffer);
    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    await writeFile(`public/logos/${fileName}`, fileData);
    return fileName;
};

export const validateFormData = async (formData: FormData): Promise<CompanyFormErrors | CompanyDto> => {
    const name = formData.get("name");
    const year = Number(formData.get("createdYear"));
    const file = formData.get("logo");

    // Проверка имени
    if (typeof name !== "string" || name.trim().length < 5) {
        return { name: "Название должно быть строкой длиной не менее 5 символов" };
    }

    // Проверка года
    if (isNaN(year) || year < 1900) {
        return { year: "Год должен быть числом больше 1900" };
    }

    // Проверка файла
    if (!file || !(file instanceof File)) {
        return { error: "Логотип должен быть загружен как файл" };
    }
    
    if (file.size > 15_000_000) {
        return { fileError: "Файл слишком большой" };
    }

    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
        return { name: "Компания с таким названием уже существует" };
    }

    const fileName = await saveFile(file);

    return {
        name,
        createdYear: year,
        logoPath: `/logos/${fileName}`,
    };
};