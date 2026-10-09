"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Plus, Link as LinkIcon, Copy, Check, ExternalLink, Calendar, QrCode } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { formatUSDC, parseUSDC } from "@/lib/utils/format-usdc";

export default function ClientsPage() {
  const { clients, paymentLinks, createPaymentLink, profile } = useVault();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [fixedAmountStr, setFixedAmountStr] = useState("");
  const [memo, setMemo] = useState("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const fixedAmount = fixedAmountStr ? parseUSDC(fixedAmountStr) : undefined;
    createPaymentLink({
      title: title || "Consulting Invoice",
      fixedAmount,
      memo: memo || "Professional services rendered",
    });
    setIsModalOpen(false);
    setTitle("");
    setFixedAmountStr("");
    setMemo("");
  };

  const handleCopy = (ref: string) => {
    const url = `${window.location.origin}/pay/${profile.owner}?ref=${ref}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(ref);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
        <div>
          <h2 className="text-xl font-bold text-primary">Clients & Payment Links</h2>
          <p className="text-xs text-muted mt-0.5">
            Shareable payment links and client directory
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Payment Link</span>
        </button>
      </div>

      {/* Payment Links List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary">Active Payment Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentLinks.map((link) => (
            <div
              key={link.id}
              className="bg-surface rounded-card border border-border p-5 flex flex-col justify-between space-y-4 hover:border-border/80 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-primary">{link.title}</h4>
                    <span className="text-[11px] font-mono text-muted">{link.reference}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-spend/15 text-spend uppercase">
                    {link.status}
                  </span>
                </div>

                <div className="text-lg font-bold font-mono text-primary tnum">
                  {link.fixedAmount ? formatUSDC(link.fixedAmount) : "Open / Flexible Amount"}
                </div>

                {link.memo && (
                  <p className="text-xs text-muted italic">"{link.memo}"</p>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(link.reference)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-surface-elevated hover:bg-border border border-border text-xs font-medium text-primary flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedLink === link.reference ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-spend" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/pay/${profile.owner}?ref=${link.reference}`}
                  target="_blank"
                  className="p-2 rounded-lg bg-surface-elevated hover:bg-border border border-border text-muted hover:text-primary transition-colors"
                  title="Open client payment view"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Directory */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-semibold text-primary">Client Directory</h3>
        <div className="bg-surface rounded-card border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated/60 text-muted uppercase font-medium border-b border-border text-[11px]">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 font-mono">Total Paid</th>
                <th className="py-3 px-4">Last Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((cli) => (
                <tr key={cli.id} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary">{cli.name}</td>
                  <td className="py-3 px-4 text-muted">{cli.company}</td>
                  <td className="py-3 px-4 text-muted font-mono">{cli.email}</td>
                  <td className="py-3 px-4 font-mono font-bold text-spend tnum">
                    {formatUSDC(cli.totalPaid)}
                  </td>
                  <td className="py-3 px-4 text-muted">{cli.lastPaymentDate || "Recent"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Link Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-card p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-semibold text-primary">Generate Client Payment Link</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-primary text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted uppercase block mb-1">
                  Invoice Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q1 Design Retainer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-spend"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted uppercase block mb-1">
                  Fixed Amount (USDC) — Optional
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for open client amount"
                  value={fixedAmountStr}
                  onChange={(e) => setFixedAmountStr(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs font-mono text-primary focus:outline-none focus:border-spend"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted uppercase block mb-1">
                  Memo / Deliverable Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Frontend milestone deliverables and code handover"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-spend"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted hover:text-primary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-spend text-black font-semibold text-xs hover:opacity-90"
                >
                  Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
