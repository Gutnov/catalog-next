import ModalComponent from "@/components/modal";
import CompanyForm from "@/components/CompanyForm";

export function CreateCompanyModal({isOpen, toggleModal}: any) {
    return(<>
            <ModalComponent isOpen={isOpen} onOpenChange={toggleModal}>
                <CompanyForm/>
            </ModalComponent>
        </>
    )
}