import { Image, Upload, UploadFile, UploadProps } from "antd";
import { FC, useEffect, useState } from "react";
import { FileType, getBase64 } from "../../utils/file";
import UploadButton from "../shared/UploadButton";

type UploadSingleFileProps = {
    onChange: (fileList: UploadFile[]) => void;
    valueUrl: string;
}

const UploadSingleFile: FC<UploadSingleFileProps> = ({
    onChange,
    valueUrl
}) => {
    const [thumbnail, setThumbnail] = useState<UploadFile[] | any[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(valueUrl ?? '');

    const handleThumbnailPreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url ?? (file.preview as string));
        setPreviewOpen(true);
    };

    const handleThumbnailChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        onChange(newFileList)
        setThumbnail(newFileList);
    }

    useEffect(() => {
        setThumbnail(valueUrl ? [{ url: valueUrl}] : [])
    }, [valueUrl])

    return <>
        <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            fileList={thumbnail}
            onPreview={handleThumbnailPreview}
            onChange={handleThumbnailChange}
            maxCount={1}
            beforeUpload={() => false}
        >
            {thumbnail.length > 0 ? null : <UploadButton />}
        </Upload>
        {previewImage && (
            <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
            />
        )}
    </>
};

export default UploadSingleFile;
