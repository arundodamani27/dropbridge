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
        { error: "Invalid access code" },
        { status: 404 }
      );
    }

    const now = new Date();
    const expiry = new Date(data.expires_at);

    if (now > expiry) {
      return NextResponse.json(
        { error: "File expired" },
        { status: 410 }
      );
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from("temp-files")
        .createSignedUrl(data.file_path, 300);

    if (signedUrlError) {
      return NextResponse.json(
        { error: "Download link creation failed" },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from("temporary_files")
      .update({
        download_count: data.download_count + 1,
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