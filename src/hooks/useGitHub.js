import { useState, useEffect } from 'react'
import { GITHUB_USERNAME } from '../data/site'

const CACHE_KEY = 'gh_repos_v1'
const CACHE_TTL = 1000 * 60 * 10

function getCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch { return null }
}

function setCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch {}
}

export function useGitHub() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const cached = getCache()
      if (cached) { setRepos(cached); setLoading(false); return }
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12&type=public`,
          { headers: { Accept: 'application/vnd.github.v3+json' } }
        )
        if (!res.ok) throw new Error(`${res.status}`)
        const json = await res.json()
        const data = json
          .filter(r => !r.fork && !r.private)
          .map(r => ({
            id: r.id, name: r.name, description: r.description,
            url: r.html_url, homepage: r.homepage,
            stars: r.stargazers_count, forks: r.forks_count,
            language: r.language, topics: r.topics || [],
          }))
        if (!cancelled) { setCache(data); setRepos(data); setLoading(false) }
      } catch (err) {
        if (!cancelled) { setError(err.message); setLoading(false) }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { repos, loading, error }
}
