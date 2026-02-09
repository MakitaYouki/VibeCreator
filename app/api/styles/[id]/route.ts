import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

type Params = {
  params: {
    id: string
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('styles')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json(
      { error: `Failed to delete style: ${error.message}` },
      { status: 400 },
    )
  }

  return NextResponse.json({ success: true })
}

