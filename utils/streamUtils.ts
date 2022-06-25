import { Stream, Readable } from "stream";

export function bufferToStream(binary: any) {
    const readableInstanceStream = new Readable({
        read() {
            this.push(binary);
            this.push(null);
        }
    });

    return readableInstanceStream
}

export async function stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const _buf = Array<any>()

        stream.on('data', (data) => _buf.push(data))
        stream.on('end', () => resolve(Buffer.concat(_buf)))
        stream.on('error', (err) => reject(err))
    })
}