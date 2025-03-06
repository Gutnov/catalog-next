import { writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from 'uuid';
import { Company, CompanyDto } from "@/app/db/company";
import {InternalError, ValidationError} from "@/errors";


export const saveFile = async (file: File): Promise<string|null> => {
    if (file.size === 0){
        return null
    }
    const arrayBuffer = await file.arrayBuffer();
    const fileData = Buffer.from(arrayBuffer);
    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    await writeFile(`public/logos/${fileName}`, fileData);
    return fileName;
};

export const validateFormData = async (formData: FormData):
    Promise<Omit<CompanyDto, "id"> & { id?: number }> => {
    const name = formData.get("name");
    const year = Number(formData.get("createdYear"));
    const file = formData.get("logo");
    const id = formData.get("id");

    if (typeof name !== "string" || name.trim().length < 5) {
        throw new InternalError("Название должно быть строкой длиной не менее 5 символов")
    }

    if (isNaN(year) || year < 1900) {
        throw new InternalError("Год должен быть числом больше 1900")
    }

    if (id instanceof File) {
        throw new InternalError("id не должен быть загружен как файл")
    }

    if (!file || !(file instanceof File)) {
        throw new InternalError("Логотип должен быть загружен как файл")
    }

    if (file.size > 15_000_000) {
        throw new InternalError("Файл слишком большой")
    }

    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
        throw new ValidationError("Компания с таким названием уже существует")
    }

    const fileName = await saveFile(file);

    return {
        id: id ? Number(id) : undefined,
        name,
        createdYear: year,
        logoPath: fileName ? `/logos/${fileName}` : "",
    };
};