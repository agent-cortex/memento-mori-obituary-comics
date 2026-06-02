import { getApp } from "@/lib/latest-pdf";

export function GET(request) {
  return getApp().fetch(request);
}
