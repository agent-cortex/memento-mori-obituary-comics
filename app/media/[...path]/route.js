import { GET as mediaGET, HEAD as mediaHEAD } from "@/lib/blob-media";

export const runtime = "nodejs";

export function GET(request) {
  return mediaGET(request);
}

export function HEAD(request) {
  return mediaHEAD(request);
}
