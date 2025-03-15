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
    children: React.ReactNode,
    title: string
  }

  export default function ModalComponent({isOpen, onOpenChange, title, children}: Props) {
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-black">{title}</ModalHeader>
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
