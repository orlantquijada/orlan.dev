import type { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { Button } from 'ui'
import { allPosts, Post } from 'contentlayer/generated'

export default function Home({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <h1>Hello World</h1>
      <Button />
      <ul></ul>
      {posts.map((post) => (
        <li key={post._id}>
          <PostCard {...post} />
        </li>
      ))}
    </div>
  )
}

function PostCard(post: Post) {
  return (
    <div className="mb-6">
      <time dateTime={post.date} className="block text-sm text-slate-600">
        {new Date(post.date).toLocaleDateString()}
      </time>
      <h2 className="text-lg">
        <Link href={post.url}>
          <a className="text-blue-700 hover:text-blue-900">{post.title}</a>
        </Link>
      </h2>
    </div>
  )
}

export async function getStaticProps() {
  const posts = allPosts
  return { props: { posts } }
}
