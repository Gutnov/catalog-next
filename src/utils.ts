import { writeFile } from "node:fs/promises";

import { v4 as uuidv4 } from 'uuid';

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

