"use server";

import { createMemo } from "@/lib/memos";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type {
  CreateMemoAction,
  CreateMemoFormState,
} from "./types";

export const createMemoAction: CreateMemoAction = async (_state, formData) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      status: "error",
      message: "この操作を続けるにはサインインが必要です。",
    };
  }

  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string") {
    return {
      status: "error",
      message: "タイトルを入力してください。",
    };
  }

  try {
    const memo = await createMemo({
      title,
      content: typeof content === "string" ? content : "",
    });

    return { status: "success", memoId: memo.id };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "メモの保存に失敗しました。";
    return {
      status: "error",
      message,
    } satisfies CreateMemoFormState;
  }
};
