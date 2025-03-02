"use client"

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
  } from "@heroui/modal";

  type Props = {
    isOpen: boolean;
    onOpenChange: (e: boolean) => void;
    children: React.ReactNode
  }

  export default function ModalComponent({isOpen, onOpenChange, children}: Props) {
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
                <>
                <ModalHeader className="flex flex-col gap-1 text-black">Создание компании</ModalHeader>
                <ModalBody>
                  {children}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
