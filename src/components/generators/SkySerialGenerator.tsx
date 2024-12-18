import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkySerialType } from "@/utils/generators";

interface SkySerialGeneratorProps {
  type: SkySerialType;
  prefix: string;
  deviceType?: "Glass" | "Puck";
  customPrefix?: boolean;
  onTypeChange: (type: SkySerialType) => void;
  onPrefixChange: (prefix: string) => void;
  onDeviceTypeChange?: (type: "Glass" | "Puck" | undefined) => void;
  onCustomPrefixChange?: (isCustom: boolean) => void;
}

const SkySerialGenerator = ({
  type,
  prefix,
  deviceType,
  customPrefix,
  onTypeChange,
  onPrefixChange,
  onDeviceTypeChange,
  onCustomPrefixChange,
}: SkySerialGeneratorProps) => {
  return (
    <div className="space-y-4">
      <Select value={type} onValueChange={(value) => onTypeChange(value as SkySerialType)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent position="popper" className="w-full max-h-[300px] overflow-y-auto">
          <SelectItem value="IMEI">IMEI (15)</SelectItem>
          <SelectItem value="NDS">NDS (16)</SelectItem>
          <SelectItem value="SKY9">SKY9 (9)</SelectItem>
          <SelectItem value="SKY14">SKY14 (14)</SelectItem>
          <SelectItem value="SKY17">SKY17 (17)</SelectItem>
          <SelectItem value="SAGEM10">SAGEM10 (10)</SelectItem>
          <SelectItem value="ICCID">ICCID (20)</SelectItem>
          <SelectItem value="EID">EID (32)</SelectItem>
          <SelectItem value="DEVICE_APPLE">DEVICE_APPLE (12)</SelectItem>
          <SelectItem value="MAC12">MAC12 (12)</SelectItem>
          <SelectItem value="MAC16">MAC16 (16)</SelectItem>
          <SelectItem value="MAC12OR16">MAC12OR16 (16)</SelectItem>
        </SelectContent>
      </Select>

      {type === "SKY17" && onDeviceTypeChange && (
        <div className="space-y-2">
          <Label>Device Type</Label>
          <RadioGroup
            value={customPrefix ? "custom" : deviceType}
            onValueChange={(value) => {
              if (value === "custom") {
                onCustomPrefixChange?.(true);
                onDeviceTypeChange(undefined);
              } else {
                onCustomPrefixChange?.(false);
                onDeviceTypeChange(value as "Glass" | "Puck");
              }
            }}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Glass" id="glass" />
              <Label htmlFor="glass">Glass (LT02SK7)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Puck" id="puck" />
              <Label htmlFor="puck">Puck (IP0CSK5)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom">Custom Prefix</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Label htmlFor="prefix">Prefix:</Label>
        <Input
          id="prefix"
          value={prefix}
          onChange={(e) => onPrefixChange(e.target.value)}
          placeholder="Optional prefix"
          disabled={type === "SKY17" && !customPrefix}
        />
      </div>
    </div>
  );
};

export default SkySerialGenerator;