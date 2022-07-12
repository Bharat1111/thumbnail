import axios from "axios";

export default function uploadSingleFile(file: File): Promise<String> {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post('https://file.io', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_APP_FILE_IO_KEY
        }
    }).then(res => `https://file.io/${res.data.link}`);
}