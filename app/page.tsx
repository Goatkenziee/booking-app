"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TIME_SLOTS, SERVICES, getTodayStr, getMaxDate, formatTimeSlot, formatDate } from "@/lib/time-slots";

type Step = "date" | "details" | "confirm";

interface SlotInfo {
  time: string;
  available: boolean;
  formatted: string;
}

export default function BookingPage() {
  const [step, setStep] = useState<Step>("date");
  const [date, setDate] = useState(getTodayStr());
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "General Consultation", notes: "" });

  const fetchSlots = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/slots?date=${d}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots(TIME_SLOTS.map((t) => ({ time: t, available: true, formatted: formatTimeSlot(t) })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSlots(date); }, [date, fetchSlots]);

  async function handleSubmit() {
    if (!form.name || !form.email || !selectedSlot) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, date, timeSlot: selectedSlot }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const err = await res.json();
        alert(err.error || "Booking failed");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center space-y-4">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-400" />
          <h1 className="text-2xl font-bold gradient-text">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a confirmation to <strong>{form.email}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDate(date)} at {selectedSlot && formatTimeSlot(selectedSlot)}
          </p>
          <Button onClick={() => { setDone(false); setStep("date"); setSelectedSlot(null); setForm({ name: "", email: "", phone: "", service: "General Consultation", notes: "" }); }}>
            Book Another
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold gradient-text">Book a Session</h1>
          <p className="text-sm text-muted-foreground">Choose a date and time that works for you.</p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2">
          {["date", "details", "confirm"].map((s, i) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${step === s || (i < ["date", "details", "confirm"].indexOf(step)) ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {/* Step 1: Date & Time */}
        {step === "date" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4" /> Date</label>
              <Input type="date" value={date} min={getTodayStr()} max={getMaxDate()} onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4" /> Available Slots</label>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading slots...</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${
                        selectedSlot === slot.time
                          ? "border-primary bg-primary/10 text-primary"
                          : slot.available
                          ? "border-border hover:border-primary/40 hover:bg-muted"
                          : "border-border/30 text-muted-foreground/40 cursor-not-allowed"
                      }`}
                    >
                      {slot.formatted}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button className="w-full" disabled={!selectedSlot} onClick={() => setStep("details")}>
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === "details" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><User className="h-4 w-4" /> Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Mail className="h-4 w-4" /> Email *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Service</label>
              <Select options={SERVICES.map((s) => ({ value: s, label: s }))} value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Notes</label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Anything we should know?" />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep("date")}>Back</Button>
              <Button className="flex-1" disabled={!form.name || !form.email} onClick={() => setStep("confirm")}>
                Review Booking
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
              <p><strong>Date:</strong> {formatDate(date)}</p>
              <p><strong>Time:</strong> {selectedSlot && formatTimeSlot(selectedSlot)}</p>
              <p><strong>Name:</strong> {form.name}</p>
              <p><strong>Email:</strong> {form.email}</p>
              {form.phone && <p><strong>Phone:</strong> {form.phone}</p>}
              <p><strong>Service:</strong> {form.service}</p>
              {form.notes && <p><strong>Notes:</strong> {form.notes}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep("details")}>Back</Button>
              <Button className="flex-1" disabled={submitting} onClick={handleSubmit}>
                {submitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
}
