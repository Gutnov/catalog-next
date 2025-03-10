import {Company, CompanyDto} from "@/db/company";
import {InternalError, ValidationError} from "@/errors";
import {saveFile} from "@/utils";

export const cleanCompanyFormData = async (formData: FormData):
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

    // fixme: this should not be done here.
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