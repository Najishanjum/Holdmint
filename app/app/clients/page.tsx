"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Plus, Link as LinkIcon, Copy, Check, ExternalLink, Calendar, QrCode, Terminal, X } from "lucide-react";
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
      {/* Neo-Brutalist Header */}
      <div className="bg-[#050505] neo-border neo-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#E8FF00] inline-block animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#E8FF00]">
              CLIENT INVOICING & ROUTING DIRECTORY
            </span>
          </div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white">
            Clients & Payment Links
          </h2>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Shareable smart-contract invoice URLs with automatic source withholding
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="neo-btn bg-[#E8FF00] text-black font-mono font-black text-xs uppercase tracking-wider px-5 py-3 neo-border neo-shadow flex items-center gap-2 hover:bg-[#d8ed00] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Payment Link</span>
        </button>
      </div>

      {/* Payment Links Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#E8FF00]" />
            <span>Active Payment Links ({paymentLinks.length})</span>
          </h3>
          <span className="text-xs font-mono text-white/50 uppercase">Instant USDC Settlement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paymentLinks.map((link) => (
            <div
              key={link.id}
              className="bg-white neo-border neo-shadow flex flex-col justify-between"
            >
              {/* Terminal Card Header */}
              <div className="bg-[#050505] text-white px-3.5 py-2 flex items-center justify-between border-b-2 border-black">
                <span className="font-mono text-[11px] text-[#E8FF00] font-bold">REF // {link.reference}</span>
                <span className="px-2 py-0.5 bg-[#21D99B] text-black font-mono text-[9px] font-black uppercase">
                  {link.status}
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1">
                <div>
                  <h4 className="font-display text-lg font-black uppercase tracking-tight text-black line-clamp-1">
                    {link.title}
                  </h4>
                  <div className="font-mono text-2xl font-black text-black mt-1 tnum">
                    {link.fixedAmount ? formatUSDC(link.fixedAmount) : "OPEN AMOUNT"}
                  </div>
                </div>

                {link.memo && (
                  <div className="p-2.5 bg-[#F2F0F7] neo-border text-xs font-mono text-black/80">
                    "{link.memo}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#F2F0F7] border-t-2 border-black flex items-center gap-2">
                <button
                  onClick={() => handleCopy(link.reference)}
                  className="flex-1 neo-btn py-2 px-3 bg-white hover:bg-[#E8FF00] neo-border text-xs font-mono font-bold text-black flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedLink === link.reference ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black font-bold" />
                      <span className="font-black">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY LINK</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/pay/${profile.owner}?ref=${link.reference}`}
                  target="_blank"
                  className="p-2 bg-white hover:bg-[#5919F6] hover:text-white neo-border text-black transition-colors"
                  title="Open client payment view"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Directory */}
      <div className="space-y-3 pt-4">
        <h3 className="font-display text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#5919F6]" />
          <span>Client Roster & Payment History</span>
        </h3>

        <div className="bg-white neo-border neo-shadow overflow-hidden">
          <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase tracking-wider">
            <span>CLIENT AUDIT LOG</span>
            <span className="text-[#E8FF00]">{clients.length} VERIFIED ENTITIES</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F2F0F7] text-black uppercase font-black border-b-2 border-black text-[11px]">
                <tr>
                  <th className="py-3 px-4 border-r-2 border-black">Client Name</th>
                  <th className="py-3 px-4 border-r-2 border-black">Company / DAO</th>
                  <th className="py-3 px-4 border-r-2 border-black">Contact</th>
                  <th className="py-3 px-4 border-r-2 border-black font-mono">Total Paid (USDC)</th>
                  <th className="py-3 px-4">Last Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {clients.map((cli) => (
                  <tr key={cli.id} className="hover:bg-[#E8FF00]/15 transition-colors">
                    <td className="py-3 px-4 font-bold text-black border-r-2 border-black">
                      {cli.name}
                    </td>
                    <td className="py-3 px-4 text-black/80 border-r-2 border-black">
                      {cli.company}
                    </td>
                    <td className="py-3 px-4 text-black/70 border-r-2 border-black">
                      {cli.email}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-[#5919F6] border-r-2 border-black tnum text-sm">
                      {formatUSDC(cli.totalPaid)}
                    </td>
                    <td className="py-3 px-4 text-black/80 font-bold">
                      {cli.lastPaymentDate || "Recent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Link Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white neo-border neo-shadow-lg relative">
            {/* Modal Terminal Header */}
            <div className="bg-[#050505] text-white px-4 py-3 flex items-center justify-between border-b-2 border-black">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#E8FF00]">
                GENERATE INVOICE LINK // PDA ROUTE
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-[#E8FF00] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-black uppercase block mb-1">
                  Invoice / Deliverable Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q1 Smart Contract Audit Retainer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F2F0F7] neo-border px-3 py-2 text-xs font-mono text-black focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-black uppercase block mb-1">
                  Fixed Amount (USDC) — Optional
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for open payer amount"
                  value={fixedAmountStr}
                  onChange={(e) => setFixedAmountStr(e.target.value)}
                  className="w-full bg-[#F2F0F7] neo-border px-3 py-2 text-xs font-mono text-black focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-black uppercase block mb-1">
                  Memo / Milestone Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Protocol audit deliverables, zero-knowledge verification handover"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full bg-[#F2F0F7] neo-border px-3 py-2 text-xs font-mono text-black focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-[#F2F0F7] neo-border text-black font-mono font-bold text-xs uppercase hover:bg-black/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 neo-btn bg-[#5919F6] text-white neo-border neo-shadow font-mono font-black text-xs uppercase tracking-wider hover:bg-[#4d13dd]"
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
