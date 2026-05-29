/* Cart panel + quote summary. "Request quote" sends an enquiry via WhatsApp.
   Nothing is charged online — this is a catalogue + enquiry flow. */
import React from "react";
import { Icon, Money, fmt, Tile, Stepper } from "./primitives.jsx";
import { SITE_CONFIG } from "../config.js";

function totals(items, gstRate) {
  const subtotal = items.reduce((s, r) => s + r.p.price * r.qty, 0);
  const gst = (subtotal * gstRate) / 100;
  return { subtotal, gst, total: subtotal + gst };
}

// Build a wa.me link with an itemised, pre-filled enquiry message.
export function buildWhatsAppURL(items, gstRate, customer) {
  const { subtotal, gst, total } = totals(items, gstRate);
  const lines = items.map((r) => `• ${r.qty} × ${r.p.name} (${r.p.brand}) — ₹${fmt(r.p.price * r.qty)}`);
  const msg =
    `Hi ${SITE_CONFIG.shopName}, I'd like a quote for:\n` +
    `${lines.join("\n")}\n\n` +
    `Subtotal: ₹${fmt(subtotal)}\n` +
    `GST (${gstRate}%): ₹${fmt(gst)}\n` +
    `Estimated total: ₹${fmt(total)}\n\n` +
    `Name: ${customer.name || "-"}\n` +
    `Phone: ${customer.phone || "-"}`;
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function CartPanel({ open, items, gstRate, customer, setCustomer, onClose, onDec, onInc, onRemove, onClear, onCheckout }) {
  const { subtotal, gst, total } = totals(items, gstRate);
  const count = items.reduce((s, r) => s + r.qty, 0);

  return (
    <aside className="cart" data-on={open}>
      <div className="cart-head">
        <h3>Your enquiry {count > 0 && <span className="muted" style={{ fontWeight: 500, fontSize: 14 }}>· {count} items</span>}</h3>
        <button className="icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>

      {items.length === 0 ? (
        <div className="empty" style={{ flex: 1 }}>
          <span className="ic"><Icon name="shopping-cart" size={26} stroke={1.6} /></span>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-dim)", fontSize: 15 }}>No items yet</div>
            <div style={{ marginTop: 4, fontSize: 13 }}>Add products from the catalog to build an enquiry.</div>
          </div>
        </div>
      ) : (
        <div className="cart-items">
          {items.map((r) => (
            <div className="cart-row" key={r.p.id}>
              <Tile catId={r.p.category} size="mini" image={r.p.image} />
              <div>
                <div className="cr-name">{r.p.name}</div>
                <div className="cr-meta">{r.p.brand} · <Money value={r.p.price} /> each</div>
                <div style={{ marginTop: 8 }}>
                  <Stepper value={r.qty} onDec={() => onDec(r.p.id)} onInc={() => onInc(r.p.id)} />
                </div>
              </div>
              <div className="cr-right">
                <button className="rm" onClick={() => onRemove(r.p.id)} aria-label="Remove"><Icon name="trash-2" size={16} stroke={1.7} /></button>
                <span className="cr-price"><Money value={r.p.price * r.qty} /></span>
              </div>
            </div>
          ))}
          <button className="btn btn-danger btn-sm" style={{ width: "100%", marginTop: 4 }} onClick={onClear}>
            <Icon name="trash" size={15} stroke={1.8} />Clear all
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="cart-summary">
          <div className="field-row" style={{ marginBottom: 14 }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Your name</label>
              <input value={customer.name} placeholder="Name" onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Phone</label>
              <input value={customer.phone} placeholder="For us to call back" onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            </div>
          </div>
          <div className="sum-line"><span>Subtotal</span><span className="v"><Money value={subtotal} /></span></div>
          <div className="sum-line"><span>GST ({gstRate}%) · indicative</span><span className="v"><Money value={gst} /></span></div>
          <div className="sum-line total"><span>Estimated total</span><span><Money value={total} /></span></div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onCheckout}>
            <Icon name="receipt" size={17} stroke={1.8} />Request quote
          </button>
        </div>
      )}
    </aside>
  );
}

export function QuoteSummary({ open, items, gstRate, customer, onClose, onNew }) {
  const ref = React.useMemo(() => "LP-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.floor(1000 + Math.random() * 9000), [open]);
  if (!open) return null;
  const { subtotal, gst, total } = totals(items, gstRate);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) + " · " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const sendWhatsApp = () => window.open(buildWhatsAppURL(items, gstRate, customer), "_blank", "noopener");

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal-scrim" />
      <div className="modal" id="receipt-print" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-head">
          <div className="rmark"><Icon name="lightbulb" size={24} stroke={1.8} /></div>
          <h3>{SITE_CONFIG.shopName.toUpperCase()}</h3>
          <div className="addr">Lighting &amp; Electricals · {SITE_CONFIG.location}<br />GSTIN {SITE_CONFIG.gstin}</div>
        </div>
        <div className="receipt-body">
          <div className="r-meta">
            <div>
              <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 13 }}>{customer.name || "Customer"}</div>
              {customer.phone && <div style={{ marginTop: 2 }}>{customer.phone}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 13 }}>{ref}</div>
              <div style={{ marginTop: 2 }}>{dateStr}</div>
            </div>
          </div>
          <table className="r-table">
            <thead>
              <tr><th>Item</th><th className="num">Qty</th><th className="num">Rate</th><th className="num">Amount</th></tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.p.id}>
                  <td><div className="rn">{r.p.name}</div><div className="rb">{r.p.brand} · {r.p.watt}</div></td>
                  <td className="num">{r.qty}</td>
                  <td className="num">{fmt(r.p.price)}</td>
                  <td className="num">{fmt(r.p.price * r.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16 }}>
            <div className="sum-line"><span>Subtotal</span><span className="v"><Money value={subtotal} /></span></div>
            <div className="sum-line"><span>GST ({gstRate}%) · indicative</span><span className="v"><Money value={gst} /></span></div>
            <div className="sum-line total"><span>Estimated total</span><span><Money value={total} /></span></div>
          </div>
          <div className="receipt-note">This is an estimate, not a tax invoice. Send it to us on WhatsApp and we’ll confirm availability, final pricing and delivery.</div>
        </div>
        <div className="modal-actions no-print">
          <button className="btn btn-ghost" onClick={onNew}><Icon name="plus" size={16} stroke={2} />New enquiry</button>
          <button className="btn btn-ghost" onClick={() => window.print()}><Icon name="printer" size={16} stroke={1.8} />Print / Save</button>
          <button className="btn btn-primary" onClick={sendWhatsApp}><Icon name="send" size={16} stroke={1.8} />Send on WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
