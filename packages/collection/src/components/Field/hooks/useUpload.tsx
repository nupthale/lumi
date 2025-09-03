import { Ref } from 'vue';

import { nanoid } from 'nanoid';
import { message } from 'ant-design-vue';
import i18next from 'i18next';

import { ColumnType, FileType } from "@collection/interface";
import { cellFileUploaded$, cellFileUploading$ } from '@collection/events';

import { upload_preset, cloud_name } from '~/uploadToken';

export const useUpload = (
    id: string,
    rowId: Ref<string>, 
    column: Ref<ColumnType>, 
) => {
    const uploadCellFile = async (e: Event) => {
        const file = (e.target as HTMLInputElement)?.files?.[0];
    
        if (!file) return;
    
        const fileId = nanoid(8);
    
        // 先emit push一个loading状态
        cellFileUploading$.next({
            id,
            rowId: rowId.value,
            columnId: column.value.id,
            file: {
                id: fileId,
                url: '',
                name: file.name,
                uploading: true,
            }
        });
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', upload_preset); // 从 Cloudinary 控制台获取
        formData.append('cloud_name', cloud_name);       // 从 Cloudinary 控制台获取
    
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dybz0bvui/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );
    
        const data = await response.json();

        if (data.secure_url) {
            cellFileUploaded$.next({
                id,
                rowId: rowId.value,
                columnId: column.value.id,
                fileId,
                file: {
                    id: data.public_id,
                    url: data.secure_url,
                    name: file.name,
                    uploading: false,
                }
            });
        } else {
            message.error(i18next.t('editor.image.uploadFailed'));
        }
    }

    return {
        uploadCellFile,
    };
}