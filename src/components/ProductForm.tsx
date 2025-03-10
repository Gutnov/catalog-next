"use client"

import { Input } from "@heroui/input";
import { useState, ChangeEvent } from "react";
import { Button } from "@heroui/button";
// import {createOrUpdateProduct} from "@/app/actions/product";

type Props = {
    companyId: number;
    product?: { id?: number; name: string } | null;
};

export default function ProductForm({ companyId, product }: Props) {
    const [name, setName] = useState(product?.name ?? "");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Название товара не может быть пустым");
            return;
        }
        setError("");

        alert("Not implemented")
        // await createOrUpdateProduct({ id: product?.id, name, companyId });
        setName("");
    };

    return (
        <form onSubmit={handleSubmit} className="pb-5 pt-5">
            <Input
                className="mb-5"
                label="Название товара"
                name="name"
                value={name}
                type="text"
                onInput={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                errorMessage={error}
                isInvalid={!!error}
            />
            <Button
                disabled={!name.trim()}
                color="primary"
                type="submit"
                className="px-10 block mx-auto max-w-full w-full"
            >
                {product ? "Обновить" : "Создать"}
            </Button>
        </form>
    );
}