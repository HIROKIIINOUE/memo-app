"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { deleteMemo, updateMemo } from "@/lib/memos";
import type { EditMemoAction, EditMemoFormState } from "./types";

export const updateMemoAction: EditMemoAction = async (_state, formData) => {
  const memoId = formData.get("memoId");
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof memoId !== "string" || memoId.length === 0) {
    return {
      status: "error",
      message: "メモを特定できませんでした。再度お試しください。",
    } satisfies EditMemoFormState;
  }

  if (typeof title !== "string") {
    return {
      status: "error",
      message: "タイトルを入力してください。",
    } satisfies EditMemoFormState;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      status: "error",
      message: "この操作を続けるにはサインインが必要です。",
    } satisfies EditMemoFormState;
  }

  try {
    await updateMemo({
      id: memoId,
      title,
      content: typeof content === "string" ? content : "",
    });

    revalidatePath(`/memo/${memoId}`);
    revalidatePath("/memo");

    return { status: "success" } satisfies EditMemoFormState;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "メモの更新に失敗しました。";

    return {
      status: "error",
      message,
    } satisfies EditMemoFormState;
  }
};

export const deleteMemoAction = async (formData: FormData) => {
  const memoId = formData.get("memoId");

  if (typeof memoId !== "string" || memoId.length === 0) {
    throw new Error("メモを特定できませんでした。");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("この操作を続けるにはサインインが必要です。");
  }

  await deleteMemo(memoId);

  revalidatePath("/memo");
  revalidatePath(`/memo/${memoId}`);

  redirect("/memo");
};
