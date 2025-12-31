import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { agreementId, copyrightAssigned } = await request.json()

    if (!agreementId) {
      return NextResponse.json({ error: "Agreement ID is required" }, { status: 400 })
    }

    // Update copyright assignment status
    const { data, error } = await supabase
      .from("publisher_agreements")
      .update({
        copyright_assigned: copyrightAssigned,
        updated_at: new Date().toISOString(),
      })
      .eq("id", agreementId)
      .eq("author_id", user.id) // Ensure user can only update their own agreements
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update copyright assignment" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      agreement: data,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
