import cloudinary from '@/lib/cloudinary'

interface CloudinaryUploadResult {
  secure_url: string
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const file = formData.get('file')

    if (!(file instanceof File)) {
      return Response.json({ error: 'No file' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'profiles',
          },
          (err, res) => {
            if (err) {
              reject(err)
              return
            }

            if (!res) {
              reject(new Error('Upload failed'))
              return
            }

            resolve({
              secure_url: res.secure_url,
            })
          }
        )
        .end(buffer)
    })

    return Response.json({
      url: result.secure_url,
    })
  } catch {
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
