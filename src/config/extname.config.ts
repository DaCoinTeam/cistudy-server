export const extnameConfig = () => ({
    extnameToContentType,
})

type Extname = ".mpd" | ".json" | ".mkv" | ".mp4" | ".avi" | ".webm" | ".mov" | ".jpg";

const extnameToContentType: Record<Extname, string> = {
    ".mpd": "application/dash+xml",
    ".json": "application/json",
    ".mkv": "video/x-matroska",
    ".mp4": "video/mp4",
    ".avi": "video/x-msvideo",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".jpg": "image/jpeg"
}
