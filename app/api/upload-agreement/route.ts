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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const manuscriptTitle = formData.get("manuscriptTitle") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Create unique file path
    const timestamp = Date.now()
    const fileName = `${user.id}/${timestamp}-${file.name}`
    const filePath = `publisher-agreements/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from("agreements").upload(filePath, file, {
      contentType: "application/pdf",
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Save agreement record to database
    const { data: agreementData, error: dbError } = await supabase
      .from("publisher_agreements")
      .insert({
        author_id: user.id,
        manuscript_title: manuscriptTitle || "Untitled",
        agreement_file_path: uploadData.path,
        agreement_file_name: file.name,
        agreement_file_size: file.size,
        verified: false,
        copyright_assigned: false,
        status: "pending",
      })
      .select()
      .single()

    if (dbError) {
      // Clean up uploaded file
      await supabase.storage.from("agreements").remove([filePath])
      return NextResponse.json({ error: "Failed to save agreement record" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      agreement: agreementData,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
