import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function TestDbPage() {
  const supabase = await createClient()

  const { data: styles, error } = await supabase
    .from('styles')
    .select('*')

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <h1>Database connection test</h1>
      <p>
        <Link href="/">← Back to home</Link>
      </p>

      {error && (
        <section style={{ marginTop: 16 }}>
          <h2 style={{ color: 'crimson' }}>Error</h2>
          <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto' }}>
            {error.message}
          </pre>
          <p style={{ marginTop: 8, color: '#666' }}>
            Check that <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set in .env.local and
            that the &quot;styles&quot; table exists in your Supabase project.
          </p>
        </section>
      )}

      {!error && styles && (
        <section style={{ marginTop: 16 }}>
          <h2>Styles table ({styles.length} record{styles.length !== 1 ? 's' : ''})</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {styles.length === 0 ? (
              <li style={{ color: '#666' }}>No records in the styles table.</li>
            ) : (
              styles.map((row, i) => (
                <li
                  key={i}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    background: '#f9f9f9',
                    borderRadius: 6,
                  }}
                >
                  <pre style={{ margin: 0, fontSize: 13, overflow: 'auto' }}>
                    {JSON.stringify(row, null, 2)}
                  </pre>
                </li>
              ))
            )}
          </ul>
        </section>
      )}
    </main>
  )
}
