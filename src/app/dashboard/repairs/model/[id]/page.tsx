import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ModelDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: model } = await supabase
    .from("models")
    .select("*, brand:brands(name)")
    .eq("id", id)
    .single();

  if (!model) notFound();

  const { data: modelRepairs } = await supabase
    .from("model_repairs")
    .select("*, repair_type:repair_types(name)")
    .eq("model_id", id)
    .order("created_at");

  const brandName = (model.brand as { name: string })?.name;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-1">
        <Link href="/dashboard/repairs" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowRight size={18} />
        </Link>
        <p className="text-sm text-slate-400">{brandName}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{model.name}</h1>
          {!model.is_active && (
            <Badge className="bg-slate-100 text-slate-500 mt-1">לא פעיל</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/repairs/new?type=model_repair&model_id=${id}`}>
            <Button size="sm">
              <Plus size={15} /> הוסף תיקון
            </Button>
          </Link>
          <Link href={`/dashboard/repairs/edit-model/${id}`}>
            <Button size="sm" variant="outline">
              <Pencil size={15} /> ערוך דגם
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {!modelRepairs || modelRepairs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-400 mb-4">אין תיקונים לדגם זה עדיין</p>
            <Link href={`/dashboard/repairs/new?type=model_repair&model_id=${id}`}>
              <Button>
                <Plus size={16} /> הוסף תיקון ראשון
              </Button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-right px-4 py-3 font-semibold text-slate-600">סוג תיקון</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">מחיר</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">זמן</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">סטטוס</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modelRepairs.map((mr) => (
                <tr key={mr.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {(mr.repair_type as { name: string })?.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">₪{mr.price}</td>
                  <td className="px-4 py-3 text-slate-500">{mr.duration_min} דק'</td>
                  <td className="px-4 py-3">
                    {mr.is_active ? (
                      <Badge className="bg-green-100 text-green-700">פעיל</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-500">לא פעיל</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/repairs/model-repair/${mr.id}`}>
                      <Button size="sm" variant="ghost">
                        <Pencil size={14} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
