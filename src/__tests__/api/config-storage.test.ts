import { describe, it, expect, afterEach } from "vitest";
import { GET } from "@/app/api/config/storage/route";

describe("GET /api/config/storage", () => {
  afterEach(() => {
    delete process.env.ENABLED_STORAGE;
  });

  it("should return url mode and supportsUpload=false by default", async () => {
    delete process.env.ENABLED_STORAGE;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mode).toBe("url");
    expect(data.supportsUpload).toBe(false);
  });

  it("should return supportsUpload=false when ENABLED_STORAGE is url", async () => {
    process.env.ENABLED_STORAGE = "url";

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mode).toBe("url");
    expect(data.supportsUpload).toBe(false);
  });

  it("should return supportsUpload=true for s3 storage", async () => {
    process.env.ENABLED_STORAGE = "s3";

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mode).toBe("s3");
    expect(data.supportsUpload).toBe(true);
  });

  it("should return supportsUpload=true for do-spaces storage", async () => {
    process.env.ENABLED_STORAGE = "do-spaces";

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mode).toBe("do-spaces");
    expect(data.supportsUpload).toBe(true);
  });

  it("should reflect the mode value in the response", async () => {
    process.env.ENABLED_STORAGE = "s3";

    const response = await GET();
    const data = await response.json();

    expect(data.mode).toBe("s3");
  });
});
