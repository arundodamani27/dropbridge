import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { accessCode } = await request.json();

    if (!accessCode) {
      return NextResponse.json(
        { error: "Access code required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("temporary_files")
      .select("*")
      .eq("access_code", accessCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Invalid or already used code" },
        { status: 404 }
      );
    }

    // Expiry check
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      await supabaseAdmin.storage
        .from("temp-files")
        .remove([data.file_path]);

      await supabaseAdmin
        .from("temporary_files")
        .delete()
        .eq("id", data.id);

      return NextResponse.json(
        { error: "File expired. Upload again." },
        { status: 410 }
      );
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from("temp-files")
        .createSignedUrl(data.file_path, 120, {
          download: data.file_name,
        });

    if (signedUrlError) {
      return NextResponse.json(
        { error: "Failed to create download link" },
        { status: 500 }
      );
    }

    // Mark one-time use
    await supabaseAdmin
      .from("temporary_files")
      .update({
        is_active: false,
      })
      .eq("id", data.id);

    return NextResponse.json({
      success: true,
      fileName: data.file_name,
      downloadUrl: signedUrlData.signedUrl,
    });

  } catch {
    return NextResponse.json(
      { error: "Request failed" },
      { status: 500 }
    );
  }
}