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
  onTypeChange: (type: SkySerialType) => void;
  onPrefixChange: (prefix: string) => void;
  onDeviceTypeChange?: (type: "Glass" | "Puck") => void;
}

const SkySerialGenerator = ({
  type,
  prefix,
  deviceType,
  onTypeChange,
  onPrefixChange,
  onDeviceTypeChange,
}: SkySerialGeneratorProps) => {
  return (
    <div className="space-y-4">
      <Select value={type} onValueChange={(value) => onTypeChange(value as SkySerialType)}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
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
            value={deviceType}
            onValueChange={onDeviceTypeChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Glass" id="glass" />
              <Label htmlFor="glass">Glass</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Puck" id="puck" />
              <Label htmlFor="puck">Puck</Label>
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
          disabled={type === "SKY17"}
        />
      </div>
    </div>
  );
};

export default SkySerialGenerator;