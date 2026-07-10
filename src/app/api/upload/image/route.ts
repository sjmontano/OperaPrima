import cloudinary from '@/lib/cloudinary'

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/tiff',
]
const MAX_SIZE = 10 * 1024 * 1024
const FOLDERS = ['hero', 'partners', 'content', 'general'] as const

interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const folder = (formData.get('folder') as string) || 'general'

    if (!(file instanceof File)) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: `Tipo de archivo no permitido. Tipos aceptados: PNG, JPG, WebP, GIF, AVIF, TIFF` },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'El archivo excede el límite de 10 MB' }, { status: 400 })
    }

    if (!FOLDERS.includes(folder as (typeof FOLDERS)[number])) {
      return Response.json(
        { error: `Carpeta no válida. Opciones: ${FOLDERS.join(', ')}` },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `opera-prima/${folder}`,
            quality: 'auto:good',
            fetch_format: 'auto',
            format: 'webp',
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
              public_id: res.public_id,
            })
          }
        )
        .end(buffer)
    })

    return Response.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Error al subir la imagen' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { publicId } = await req.json()

    if (!publicId || typeof publicId !== 'string') {
      return Response.json({ error: 'publicId requerido' }, { status: 400 })
    }

    await cloudinary.uploader.destroy(publicId)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return Response.json({ error: 'Error al eliminar la imagen' }, { status: 500 })
  }
}
