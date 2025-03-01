import { Input } from "@heroui/input";
import { useActionState, useState, useCallback, FormEvent, useEffect } from "react";
import { createCompanyAction } from "@/app/actions/company";
import { Button } from "@heroui/button";
import { MIN_COMPANY_YEAR } from "@/settings";
import { debounce } from "@/helper";

export default function CompanyForm() {
  const [createdYear, setCreatedYear] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState('');
  const [yearError, setYearError] = useState('');

  const [formState, action] = useActionState(createCompanyAction, {
    name: "",
    year: "",
    error: ""
  });
  

  const createdYearLabel = `Год создания: от ${MIN_COMPANY_YEAR} до ${new Date().getFullYear()}`;
  const resetErrors = () => {
    setNameError('');
    setYearError('');
  }
  const validateForm = useCallback((nameValue: string, yearValue: string) => {
    resetErrors()
    let isValid = true;
    const currentYear = new Date().getFullYear();
    if (!nameValue || nameValue.length < 5) {
      setNameError('Название компании должно быть не менее 5 символов')
      isValid = false
    }
    if (!yearValue) {
      setYearError('Год создания не может быть пустым');
      isValid = false
    }
    if (Number(yearValue) < MIN_COMPANY_YEAR) {
      setYearError(`Год создания не может быть меньше ${MIN_COMPANY_YEAR}`);
      isValid = false
    }
    if (Number(yearValue) > currentYear) {
      setYearError(`Год создания не может быть больше ${currentYear}`);
      isValid = false
    }
    return isValid
  }, []);

  const debouncedValidate = useCallback(debounce(validateForm, 500), [validateForm]);

  const onInputCreatedYear = (e: FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, "");
    input.value = digitsOnly;
    setCreatedYear(digitsOnly);
    debouncedValidate(name, digitsOnly);
  };

  const onInputName = (e: FormEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    debouncedValidate(newName, createdYear);
  };

  const handleCompanyForm = async (formData: FormData) => {
    if (!validateForm(name, createdYear)) return
    await action(formData);
  };

  return (
    <form action={handleCompanyForm} className="pb-5 pt-5 relative">
      <span className="text-red-600 absolute -top-2x left-0">{formState.error}</span>
      <div className="mb-5">
        <Input 
          label="Название" 
          name={"name"} 
          value={name} 
          type="text" 
          onInput={onInputName} 
          errorMessage={nameError} 
          isInvalid={!!nameError} 
        />
      </div>
      <div className="mb-5">
        <Input label={createdYearLabel} name={"createdYear"} value={createdYear} onInput={onInputCreatedYear} errorMessage={yearError} isInvalid={!!yearError} />
      </div>
      <Button
        disabled={!!nameError || !!yearError}
        color="primary"
        type="submit"
        className="px-10 block mx-auto max-w-full w-full disabled:opacity-50 disabled:hover:opacity-50 disabled:hover:pointer-events-none disabled:cursor-not-allowed cursor-pointer"
      >
        Сохранить
      </Button>
    </form>
  );
}