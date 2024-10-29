import { FC, useState } from "react";
import { ClinicResource } from "../../../resources";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { Button, message } from "antd";
import clinicService from "../../../services/clinic-service";
import { IntroductionRequest } from "./IntroducationForm";

const mdParser = new MarkdownIt(/* Markdown-it options */);

type IntroductionClinicFormProps = {
    clinic: ClinicResource;
    onRefresh: () => void
}

const IntroductionClinicForm: FC<IntroductionClinicFormProps> = ({
    clinic,
    onRefresh
}) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<IntroductionRequest>({
        introductionPlain: clinic.introductionPlain ?? '',
        introductionHtml: clinic.introductionHtml ?? ''
    })
    function handleEditorChange({ html, text }: { html: string, text: string }) {
        setData({
            ...data,
            introductionHtml: html,
            introductionPlain: text
        })
    }


    const handleSubmit = async () => {
        setLoading(true)
        const response = await clinicService.updateIntroduction(data);
        setLoading(false)
        if (response.success) {
            message.success(response.message)
            onRefresh()
        } else {
            message.error(response.message)
        }
    }

    return <div className="flex flex-col items-start gap-y-2">
        <span className="text-left text-[17px] font-semibold">Giới thiệu</span>
        <MdEditor
            value={data.introductionPlain}
            style={{ minHeight: '500px', width: '100%' }}
            className="w-full text-left overflow-y-auto"
            renderHTML={text => mdParser.render(text)}
            onChange={handleEditorChange}
        />

        <div className="flex w-full justify-end">
            <Button type="primary" htmlType="button" onClick={handleSubmit} disabled={loading} loading={loading} className="mt-4" >
                Lưu lại
            </Button>
        </div>

    </div>
};

export default IntroductionClinicForm;
