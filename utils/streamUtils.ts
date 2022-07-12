import { Stream, Readable } from "stream";

export async function bufferToStream(binary: any) {
    // const readableInstanceStream = new Readable({
    //     read() {
    //         this.push(binary);
    //         this.push(null);
    //     }
    // });

    const readable = new Readable()
    readable._read = () => {} // _read is required but you can noop it
    readable.push(binary)
    readable.push(null)
    return readable
}

export async function stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const _buf = Array<any>()

        stream.on('data', (data) => _buf.push(data))
        stream.on('end', () => resolve(Buffer.concat(_buf)))
        stream.on('error', (err) => reject(err))
    })
}

export async function streamToBuffer(stream: Stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const _buf = Array<any>()

        stream.on('data', (data) => _buf.push(data))
        stream.on('end', () => resolve(Buffer.concat(_buf)))
        stream.on('error', (err) => reject(err))
    })
}   