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
  import { useState } from 'react';

  type Props = {
    isOpen: boolean;
    onOpenChange: (e: boolean) => void;
    closeModal: () => void,
    onSubmit: (payload: {name: string, createdYear: number}) => void
  }
  
  export default function CreateCompanyModal({isOpen, onOpenChange, closeModal, onSubmit}: Props) { 
    const [createdYear, setCreatedYear] = useState(0)
    const [name, setName] = useState('')
    const saveCompany = async () => {
      if (!name || !createdYear) alert('Введите данные компании')
        await onSubmit({ name, createdYear })
        closeModal()
    }
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-black">Создание компании</ModalHeader>
                <ModalBody>
                    <div>
                        <div className='mb-5'>
                            <Input label="Название" type="text" onInput={(e) => setName(e.target.value)}/>
                        </div>
                        <div className='mb-5'>
                            <NumberInput label="Год основания" onInput={(e) => setCreatedYear(Number(e.target.value))} />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={closeModal}>
                    Отмена
                  </Button>
                  <Button color="primary" onPress={saveCompany}>
                    Сохранить
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  