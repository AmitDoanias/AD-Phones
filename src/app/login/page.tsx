"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("אימייל או סיסמה שגויים");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="AD Phones"
            width={140}
            height={48}
            className="mx-auto h-12 w-auto mb-6"
          />
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <Lock size={22} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">כניסה לדשבורד</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="אימייל"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@adphones.co.il"
              autoComplete="email"
              required
              dir="ltr"
            />
            <Input
              label="סיסמה"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              dir="ltr"
            />

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" size="lg" loading={loading} className="mt-1">
              כניסה
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
