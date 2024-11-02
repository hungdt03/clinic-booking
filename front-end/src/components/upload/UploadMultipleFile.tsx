import { Image, Upload, UploadFile, UploadProps } from "antd";
import { InboxOutlined } from '@ant-design/icons'
import { FC, useEffect, useState } from "react";
import { FileType, getBase64 } from "../../utils/file";
import UploadButton from "../shared/UploadButton";

type UploadMultipleFileProps = {
    onChange: (fileList: UploadFile[]) => void;
    valueUrls?: string[];
    onRemoveFileUrl?: (url: string | undefined) => void
}

const { Dragger } = Upload;

const UploadMultipleFile: FC<UploadMultipleFileProps> = ({
    onChange,
    valueUrls,
    onRemoveFileUrl
}) => {
    const [fileList, setFileList] = useState<UploadFile[] | any[]>([]);
    const [previewImageOpen, setPreviewImageOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handleImagePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url ?? (file.preview as string));
        setPreviewImageOpen(true);
    };

    const handleImageChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        onChange(newFileList)
        setFileList(newFileList)
    }

    const handleRemoveFile = (file: UploadFile) => {
        if (!file.name) {
            onRemoveFileUrl?.(file.url)
        }
    }

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info) {
            onChange(info.fileList)
            setFileList(info.fileList)
        },
        onRemove: handleRemoveFile,
        beforeUpload(_) {
            return false;
        }
    };

    useEffect(() => {
        if (valueUrls) {
            setFileList([...valueUrls.map(url => ({
                url: url
            }))])
        }

    }, [valueUrls])

    return <div className="w-full">
        {fileList.length === 0 ? (

            <Dragger {...props} style={{ marginBottom: '20px' }}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Thêm ảnh</p>
                <p className="ant-upload-hint">
                    Ấn hoặc kéo thả ảnh vào khu vực này
                </p>
            </Dragger>
        ) : (
            <div className="mb-4">
                <Upload
                    beforeUpload={() => false}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handleImagePreview}
                    onChange={handleImageChange}
                    onRemove={handleRemoveFile}
                >
                    {fileList.length >= 8 ? null : <UploadButton />}
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewImageOpen,
                            onVisibleChange: (visible) => setPreviewImageOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </div>
        )}
    </div>
};

export default UploadMultipleFile;
