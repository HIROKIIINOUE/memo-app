export type EditMemoFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export type EditMemoAction = (
  state: EditMemoFormState,
  formData: FormData,
) => Promise<EditMemoFormState>;

export const editMemoInitialState: EditMemoFormState = { status: "idle" };
