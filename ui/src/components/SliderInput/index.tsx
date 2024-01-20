import { useState } from "react";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";

export default function SliderInput({ title, min, max, step, defaultValue, onChange, formatValue }: {
  title: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  onChange?: (val: number) => void;
  formatValue?: (val: number) => string;
}) {
  const [value, setValue] = useState<number>(defaultValue);

  return (
    <>
      <div className="flex justify-between items-center pb-1">
        <div className="font-bold uppercase text-sm">
          {title}
        </div>
        <div>
          <Input type="string" value={formatValue ? formatValue(value) : value} disabled className="w-32 text-right" />
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => setValue(v[0])}
        onValueCommit={(v) => onChange && onChange(v[0])} />
    </>
  )
}