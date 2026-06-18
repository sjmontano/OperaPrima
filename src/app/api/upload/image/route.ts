import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "profiles",
          },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        )
        .end(buffer);
    });

    return Response.json({
      url: result.secure_url,
    });
  } catch (error) {
    return Response.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}