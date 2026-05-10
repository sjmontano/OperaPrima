const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!

async function fetchWP<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // revalida cada hora
  })

  if (!res.ok) throw new Error(`WPGraphQL error: ${res.statusText}`)

  const { data, errors } = await res.json()
  if (errors) throw new Error(errors[0].message)

  return data as T
}

export const GET_POSTS = `
  query GetPosts($first: Int = 10) {
    posts(first: $first) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node { sourceUrl altText }
        }
      }
    }
  }
`

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      title
      content
      date
      featuredImage {
        node { sourceUrl altText }
      }
    }
  }
`

export { fetchWP }
