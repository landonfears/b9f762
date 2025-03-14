import type { FetchError } from "~/server/avantos";

export default function ErrorMessage({ error }: { error: FetchError }) {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-center text-6xl font-black lg:text-8xl">
        {error.message}
      </h1>
    </div>
  );
}
