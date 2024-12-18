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
        <SelectTrigger className="w-full bg-white/90 text-gray-900 border-white/20">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent position="popper" className="w-full max-h-[300px] overflow-y-auto bg-white/90 backdrop-blur-xl border-white/20">
          <SelectItem value="IMEI" className="text-gray-900 hover:bg-gray-100/90">IMEI (15)</SelectItem>
          <SelectItem value="NDS" className="text-gray-900 hover:bg-gray-100/90">NDS (16)</SelectItem>
          <SelectItem value="SKY9" className="text-gray-900 hover:bg-gray-100/90">SKY9 (9)</SelectItem>
          <SelectItem value="SKY14" className="text-gray-900 hover:bg-gray-100/90">SKY14 (14)</SelectItem>
          <SelectItem value="SKY17" className="text-gray-900 hover:bg-gray-100/90">SKY17 (17)</SelectItem>
          <SelectItem value="SAGEM10" className="text-gray-900 hover:bg-gray-100/90">SAGEM10 (10)</SelectItem>
          <SelectItem value="ICCID" className="text-gray-900 hover:bg-gray-100/90">ICCID (20)</SelectItem>
          <SelectItem value="EID" className="text-gray-900 hover:bg-gray-100/90">EID (32)</SelectItem>
          <SelectItem value="DEVICE_APPLE" className="text-gray-900 hover:bg-gray-100/90">DEVICE_APPLE (12)</SelectItem>
          <SelectItem value="MAC12" className="text-gray-900 hover:bg-gray-100/90">MAC12 (12)</SelectItem>
          <SelectItem value="MAC16" className="text-gray-900 hover:bg-gray-100/90">MAC16 (16)</SelectItem>
          <SelectItem value="MAC12OR16" className="text-gray-900 hover:bg-gray-100/90">MAC12OR16 (16)</SelectItem>
        </SelectContent>
      </Select>

      {type === "SKY17" && onDeviceTypeChange && (
        <div className="space-y-2">
          <Label className="text-white">Device Type</Label>
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
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Glass" id="glass" />
              <Label htmlFor="glass" className="text-white">Glass (LT02SK7)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Puck" id="puck" />
              <Label htmlFor="puck" className="text-white">Puck (IP0CSK5)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="text-white">Custom Prefix</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Label htmlFor="prefix" className="text-white">Prefix:</Label>
        <Input
          id="prefix"
          value={prefix}
          onChange={(e) => onPrefixChange(e.target.value)}
          placeholder="Optional prefix"
          disabled={type === "SKY17" && !customPrefix}
          className="bg-white/20 border-white/20 text-white placeholder:text-white/50"
        />
      </div>
    </div>
  );
};

export default SkySerialGenerator;