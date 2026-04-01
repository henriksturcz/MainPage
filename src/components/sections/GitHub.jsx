import { useEffect, useRef } from 'react'
import { useGitHub } from '../../hooks/useGitHub'
import { SITE } from '../../data/site'
import s from './GitHub.module.css'

export default function GitHub() {
  const ref = useRef(null)
  const { repos, loading, error } = useGitHub()

  useEffect(() => {
    if (loading) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ref.current?.querySelectorAll('.reveal').forEach((el, i) =>
            setTimeout(() => el.classList.add('visible'), i * 70)
          )
        }
      })
    }, { threshold: 0.04 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [loading])

  const onCardMove = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%')
    e.currentTarget.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%')
  }

  return (
    <section ref={ref} className={s.section} id="github">
      <div className={`${s.header} reveal`}>
        <div className={s.label}>Open Source</div>
        <h2 className={s.heading}>GitHub<br /><span className={s.outline}>Repositories</span></h2>
      </div>

      {loading && (
        <div className={s.grid}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className={s.skeleton} />)}
        </div>
      )}

      {error && (
        <div className={s.error}>
          Could not load repositories.{' '}
          <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" data-hover>View on GitHub →</a>
        </div>
      )}

      {!loading && !error && (
        <div className={s.grid}>
          {repos.map(repo => (
            <div key={repo.id} className={`${s.card} reveal`} onMouseMove={onCardMove}>
              <div className={s.cardGlow} />
              <div className={s.cardTop}>
                <span className={s.num}>#</span>
                <div className={s.cardBtns}>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer"
                    className={s.iconBtn} data-hover aria-label="GitHub">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer"
                      className={s.iconBtn} data-hover aria-label="Live site">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              <div className={s.cardBody}>
                <h3 className={s.name}>{repo.name}</h3>
                <p className={s.desc}>{repo.description || 'No description provided.'}</p>
              </div>
              {repo.topics.length > 0 && (
                <div className={s.cardFoot}>
                  <div className={s.tags}>
                    {repo.topics.slice(0, 3).map(t => <span key={t} className={s.tag}>{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={`${s.viewAll} reveal`}>
        <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" className={s.viewAllBtn} data-hover>
          View all repositories <span>→</span>
        </a>
      </div>
    </section>
  )
}