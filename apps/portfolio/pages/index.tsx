import type { InferGetStaticPropsType } from 'next'
// import Link from 'next/link'
import { Button } from 'ui'
import { allPosts } from 'contentlayer/generated'
// import { allPosts, Post } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'

export default function Home({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // const MDXComponent = useMDXComponent(posts[1].body.raw)
  const MDXContent = useMDXComponent(post.body.code)

  return (
    <div>
      <h1>Hello World</h1>
      <Button />
      <ul></ul>

      <MDXContent components={{ Button }} />

      {/* {posts.map((post) => (
        <li key={post._id}>
          <PostCard {...post} />
        </li>
      ))}

      {posts.map((post) => (
        <p key={post._id}>{post.body.raw}</p>
      ))} */}
    </div>
  )
}

// function PostCard(post: Post) {
//   return (
//     <div className="mb-6">
//       <time dateTime={post.date} className="block text-sm text-slate-600">
//         {new Date(post.date).toLocaleDateString()}
//       </time>
//       <h2 className="text-lg">
//         <Link href={post.url}>
//           <a className="text-blue-700 hover:text-blue-900">{post.title}</a>
//         </Link>
//       </h2>
//     </div>
//   )
// }

export async function getStaticProps() {
  const post = allPosts[1]

  return { props: { post } }
}
