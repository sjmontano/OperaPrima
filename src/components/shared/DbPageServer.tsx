import { prisma } from '@/lib/prisma'
import { PageRenderer, type Block } from './PageRenderer'

interface DbPageServerProps {
  slug: string
  fallback: React.ReactNode
}

export async function DbPageServer({ slug, fallback }: DbPageServerProps) {
  try {
    const page = await prisma.pageContent.findUnique({ where: { slug } })

    if (page?.published && Array.isArray(page.blocks) && page.blocks.length > 0) {
      return <PageRenderer key={slug} blocks={page.blocks as Block[]} slug={slug} />
    }
  } catch {
    // fallback on error
  }

  return <>{fallback}</>
}
