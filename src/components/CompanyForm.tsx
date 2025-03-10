import { Input } from "@heroui/input";
import {useActionState, useState, useCallback, useEffect, ChangeEvent} from "react";
import { companyFormAction } from "@/actions/company/company";
import { Button } from "@heroui/button";
import { MIN_COMPANY_YEAR } from "@/settings";
import { debounce } from "@/helper";
import { CompanyDto } from "@/db/company";
type Props = {
  // todo: remove undefined
  company?: CompanyDto | null
};

export default function CompanyForm({ company }: Props) {
  const [createdYear, setCreatedYear] = useState<string>(company?.createdYear ? String(company?.createdYear) : "");
  const [name, setName] = useState(company?.name ?? "");
  const [nameError, setNameError] = useState('');
  const [yearError, setYearError] = useState('');
  const [fileError, setFileError] = useState('');
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isYearTouched, setIsYearTouched] = useState(false);


  const [formState, action, isPending] = useActionState(companyFormAction,
    {
      nameError: "",
    }
  );

  useEffect(() => {
    if (formState.nameError){
      setNameError(formState.nameError);
    }
  }, [formState]);

  const createdYearLabel = `Год создания: от ${MIN_COMPANY_YEAR} до ${new Date().getFullYear()}`;
  const resetErrors = () => {
    setNameError('');
    setYearError('');
  }
  const validateForm = useCallback((nameValue: string, yearValue: string) => {
    resetErrors()
    let isValid = true;
    const currentYear = new Date().getFullYear();
    if (isNameTouched && (!nameValue || nameValue.length < 5)) {
      setNameError('Название компании должно быть не менее 5 символов')
      isValid = false
    }
    if (isYearTouched && !yearValue) {
      setYearError('Год создания не может быть пустым');
      isValid = false
    }
    if (isYearTouched && Number(yearValue) < MIN_COMPANY_YEAR) {
      setYearError(`Год создания не может быть меньше ${MIN_COMPANY_YEAR}`);
      isValid = false
    }
    if (isYearTouched && Number(yearValue) > currentYear) {
      setYearError(`Год создания не может быть больше ${currentYear}`);
      isValid = false
    }
    return isValid
  }, [isNameTouched, isYearTouched]);

  const debouncedValidate = useCallback(debounce(validateForm, 500), [validateForm]);

  const onInputCreatedYear = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(e.target.value))) {
      setCreatedYear(e.target.value);
    }
    debouncedValidate(name, e.target.value);
  };

  const onInputName = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNameTouched) setIsNameTouched(true);
    const newName = e.target.value;
    setName(newName);
    debouncedValidate(newName, createdYear);
  };

  const onInputLogo = (e: ChangeEvent<HTMLInputElement>) => {
    setFileError("")
    if (!e.target.files){
      throw new Error("No files")
    }
    if (e.target.files.length > 1){
      throw new Error("Single file input")
    }
    const file = e.target.files[0];
    console.log('file', file)
    if (file.size > 10_000_000){
      setFileError("To big file")
    }
  }

  const handleCompanyForm = async (formData: FormData) => {
    setIsNameTouched(true);
    setIsYearTouched(true);
    if (nameError || yearError) return
    await action(formData);
  };

  return (
    <form action={handleCompanyForm} className="pb-5 pt-5 relative">
        <input hidden name="id" value={company?.id ? String(company?.id) :  ""} readOnly/>
        <Input
          className="mb-5"
          label="Название"
          name={"name"}
          value={name}
          type="text"
          onInput={onInputName}
          errorMessage={nameError}
          isInvalid={!!nameError}
        />
        <Input label={createdYearLabel}
               className="mb-5"
               name={"createdYear"}
               type="text"
               value={createdYear}
               onInput={onInputCreatedYear}
               errorMessage={yearError}
               isInvalid={!!yearError}
        />
        <Input
            type="file"
            label="Logo"
            name="logo"
            errorMessage={fileError}
            isInvalid={!!fileError}
            onChange={onInputLogo}
        />
      <Button
        disabled={!!nameError || !!yearError || isPending}
        color="primary"
        type="submit"
        className="px-10 block mx-auto max-w-full w-full disabled:opacity-50 disabled:hover:opacity-50 disabled:hover:pointer-events-none disabled:cursor-not-allowed cursor-pointer"
      >
        Сохранить
      </Button>
    </form>
  );
}