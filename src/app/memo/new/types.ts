export type CreateMemoFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export type CreateMemoAction = (
  state: CreateMemoFormState,
  formData: FormData,
) => Promise<CreateMemoFormState>;

export const createMemoInitialState: CreateMemoFormState = { status: "idle" };
