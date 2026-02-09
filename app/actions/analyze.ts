'use server'

import { createClient } from '@/utils/supabase/server'

export type AnalyzeResult = { success: true } | { success: false; error: string }

/**
 * Calls Dify Workflow API and saves the result to the styles table.
 * Expects Dify workflow to have an input variable named "original_script".
 */
export async function runScriptAnalysis(script: string): Promise<AnalyzeResult> {
  const apiUrl = process.env.DIFY_API_URL
  const apiKey = process.env.DIFY_API_KEY

  if (!apiUrl?.trim() || !apiKey?.trim()) {
    return { success: false, error: 'DIFY_API_URL and DIFY_API_KEY must be set in .env.local' }
  }

  const runUrl = apiUrl.replace(/\/$/, '') + '/workflows/run'

  try {
    const res = await fetch(runUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: { original_script: script },
        response_mode: 'blocking',
        user: 'vibe-creator-user',
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return {
        success: false,
        error: `Dify API error (${res.status}): ${text.slice(0, 300)}`,
      }
    }

    const json = await res.json()
    const data = json.data
    const outputs = data?.outputs

    if (outputs == null) {
      return {
        success: false,
        error: 'Dify response had no data.outputs. Check your workflow output nodes.',
      }
    }

    const fallbackName = `Bilibili Style [${new Date().toISOString().slice(0, 10)}]`

    // Parse Dify output: may be a direct object { style_name, tone, ... } or a JSON string (e.g. in analysis_result)
    let parsed: Record<string, unknown>
    const outputsObj = typeof outputs === 'object' && outputs !== null ? (outputs as Record<string, unknown>) : null

    if (outputsObj && (outputsObj.style_name != null || outputsObj.tone != null || Object.keys(outputsObj).length > 0)) {
      parsed = outputsObj
    } else {
      let raw = typeof outputs === 'string' ? outputs : null
      if (raw == null && outputsObj) {
        raw = typeof outputsObj.analysis_result === 'string' ? (outputsObj.analysis_result as string) : null
        if (raw == null) {
          const firstStr = Object.values(outputsObj).find((v) => typeof v === 'string')
          raw = firstStr != null ? (firstStr as string) : null
        }
      }
      if (raw == null || typeof raw !== 'string') {
        return {
          success: false,
          error: 'Dify output did not contain a parseable object or JSON string (expected style_name and tone).',
        }
      }
      const stripped = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
      try {
        parsed = JSON.parse(stripped) as Record<string, unknown>
      } catch {
        parsed = { raw: stripped }
      }
    }

    const supabase = await createClient()

    const extractedName = parsed.style_name != null ? String(parsed.style_name).trim() : ''
    const extractedTone = parsed.tone != null ? String(parsed.tone).trim() : ''

    const row = {
      name: extractedName || fallbackName,
      description: extractedTone,
      config_json: parsed,
    }

    const { data: insertData, error: insertError } = await supabase
      .from('styles')
      .insert(row)
      .select()

    if (insertError) {
      const message = `Failed to save to database: ${insertError.message}`
      const rlsHint = ' If the error is related to permissions, check Supabase RLS policies for the styles table.'
      return {
        success: false,
        error: message + rlsHint,
      }
    }

    console.log('Insert successful:', insertData)
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}
