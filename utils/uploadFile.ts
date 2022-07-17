import axios from "axios";

export default function uploadSingleFile(file: File): Promise<String> {
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('maxDownloads', '10');
    return axios.post(`https://www.filestackapi.com/api/store/s3?key=${process.env.NEXT_PUBLIC_FILESTACK_KEY}`, file, {
        headers: {
            'Content-Type': 'image/png' || 'image/jpeg',
            // 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_FILE_IO_KEY
        }
    }).then(res => {
        return res.data.url;
    });
}