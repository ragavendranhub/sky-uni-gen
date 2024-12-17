import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RandomGeneratorProps {
  options: {
    alpha: boolean;
    numeric: boolean;
    special: boolean;
  };
  length: number;
  onOptionsChange: (options: { alpha: boolean; numeric: boolean; special: boolean }) => void;
  onLengthChange: (length: number) => void;
}

const RandomGenerator = ({ options, length, onOptionsChange, onLengthChange }: RandomGeneratorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="alpha"
            checked={options.alpha}
            onCheckedChange={(checked) =>
              onOptionsChange({ ...options, alpha: checked === true })
            }
          />
          <Label htmlFor="alpha">Alphabets</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="numeric"
            checked={options.numeric}
            onCheckedChange={(checked) =>
              onOptionsChange({ ...options, numeric: checked === true })
            }
          />
          <Label htmlFor="numeric">Numerical</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="special"
            checked={options.special}
            onCheckedChange={(checked) =>
              onOptionsChange({ ...options, special: checked === true })
            }
          />
          <Label htmlFor="special">Special</Label>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="length">Length:</Label>
        <Input
          id="length"
          type="number"
          min={1}
          max={100}
          value={length}
          onChange={(e) => onLengthChange(parseInt(e.target.value) || 1)}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default RandomGenerator;