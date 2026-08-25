import type { Metadata } from "next";
import { UploadForm } from "@/components/upload-form";

export const metadata: Metadata = {
  title: "Publish an agent",
  description:
    "Upload an agent and its skills. The category is picked automatically from what you write.",
};

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          Publish an agent
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Describe the agent and list the skills it ships with. The category is
          worked out as you type — from the name, tagline, tags and skills — and
          you can override it before publishing.
        </p>
      </header>

      <UploadForm />
    </div>
  );
}
