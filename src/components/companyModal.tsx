"use client"

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "@heroui/modal";
  import {Button} from "@heroui/button";
  import {Input} from "@heroui/input";
  import {NumberInput} from "@heroui/number-input";
  import {useActionState, useState} from 'react';
// import {useFormState} from "react-dom";
import {createCompanyAction} from "@/app/actions/company";

  type Props = {
    isOpen: boolean;
    onOpenChange: (e: boolean) => void;
    closeModal: () => void,
    // onSubmit: (payload: {name: string, createdYear: number}) => void
  }

  export default function CreateCompanyModal({isOpen, onOpenChange, closeModal}: Props) {
    const [createdYear, setCreatedYear] = useState(0)
    const [name, setName] = useState('')

    const [formState, action] = useActionState(createCompanyAction, {
        name: '',
        year: '',
        error: ''
    });


    const handleCompanyForm = async (formData: FormData) => {
      // if (!name || !createdYear) {
      //     alert('Введите данные компании')
      //     return
      // }
      // await onSubmit({ name, createdYear })
      //   console.log("formData", formData);
        await action(formData)
        // closeModal()
    }

    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
                <>
                <ModalHeader className="flex flex-col gap-1 text-black">Создание компании</ModalHeader>
                <form action={handleCompanyForm}>
                    <ModalBody>
                        <div className='mb-5'>
                            <Input label="Название" name={"name"} value={name} type="text"
                                   onInput={(e) => setName(e.target.value)}/>
                            <span>{formState.name}</span>
                        </div>
                        <div className='mb-5'>
                            <input name={'createdYear'}
                                         onInput={(e) => setCreatedYear(Number(e.target.value))}/>
                            <span>{formState.year}</span>
                        </div>
                        <span>{formState.error}</span>
                </ModalBody>
                <ModalFooter>
                <Button color="danger" variant="light" onPress={closeModal}>
                    Отмена
                  </Button>
                  <Button color="primary" type="submit">
                    Сохранить
                  </Button>
                </ModalFooter>
                </form>

                </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
