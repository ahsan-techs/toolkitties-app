"use client";

import { useState } from "react";
import { Field, inputCls, ghostBtnCls } from "./ui";

export default function PasswordInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        <input
          type={show ? "text" : "password"}
          autoComplete="off"
          className={inputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" className={ghostBtnCls} onClick={() => setShow((s) => !s)}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </Field>
  );
}
