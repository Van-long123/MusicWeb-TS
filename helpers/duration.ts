import ffmpeg from 'fluent-ffmpeg';
import ffprobe from "ffprobe-static";

// Hàm lấy thời lượng
export const duration = async (fileUrl: string): Promise<string> => {
    ffmpeg.setFfprobePath(ffprobe.path); // Thiết lập đường dẫn tới ffprobe

    return new Promise((resolve, reject) => {
        ffmpeg(fileUrl).ffprobe((err: Error | null, metadata: ffmpeg.FfprobeData) => {
            if (err) {
                return reject(`Error: ${err.message}`); // Trả về lỗi nếu xảy ra
            }

            // Tính thời lượng từ metadata
            const durationInSeconds = metadata.format.duration;
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = Math.floor(durationInSeconds % 60);

            resolve(`${minutes}:${seconds}`); // Trả về thời lượng dưới dạng chuỗi
        });
    });
};
