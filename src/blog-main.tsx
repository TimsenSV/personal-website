import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/dm-sans'
import './styles.css'
import './legal.css'
import './theme.css'
import './blog-reader.css'
import { BlogPage } from './components/BlogPage'
import { blogPosts } from './content/blog'

const slug = new URLSearchParams(window.location.search).get('post')
const post = blogPosts.find(item => item.slug === slug)
if (post) document.title = `${post.title} · timsen.me`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BlogPage post={post} missingPost={slug !== null && !post}/></React.StrictMode>,
)
