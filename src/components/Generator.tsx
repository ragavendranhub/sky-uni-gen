import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  GeneratorType,
  SkySerialType,
  generateRandom,
  generateUUID,
  generateSkySerial,
} from "@/utils/generators";

const Generator = () => {
  const [type, setType] = useState<GeneratorType>("random");
  const [randomOptions, setRandomOptions] = useState({
    alpha: true,
    numeric: true,
    special: false,
  });
  const [length, setLength] = useState(12);
  const [skySerialType, setSkySerialType] = useState<SkySerialType>("IMEI");
  const [prefix, setPrefix] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [generatedValues, setGeneratedValues] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    const values: string[] = [];

    try {
      for (let i = 0; i < quantity; i++) {
        let value = "";
        switch (type) {
          case "random":
            value = generateRandom(length, randomOptions);
            break;
          case "uuid":
            value = generateUUID();
            break;
          case "skySerials":
            value = generateSkySerial(skySerialType, prefix);
            break;
        }
        values.push(value);
      }
      setGeneratedValues(values);
      toast.success("Values generated successfully!");
    } catch (error) {
      toast.error("Error generating values");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <RadioGroup
          value={type}
          onValueChange={(value) => setType(value as GeneratorType)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="random" id="random" />
            <Label htmlFor="random">Random</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="uuid" id="uuid" />
            <Label htmlFor="uuid">UUID</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="skySerials" id="skySerials" />
            <Label htmlFor="skySerials">Sky Serials</Label>
          </div>
        </RadioGroup>

        <div className="space-y-4">
          {type === "random" && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alpha"
                    checked={randomOptions.alpha}
                    onCheckedChange={(checked) =>
                      setRandomOptions((prev) => ({
                        ...prev,
                        alpha: checked === true,
                      }))
                    }
                  />
                  <Label htmlFor="alpha">Alphabets</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numeric"
                    checked={randomOptions.numeric}
                    onCheckedChange={(checked) =>
                      setRandomOptions((prev) => ({
                        ...prev,
                        numeric: checked === true,
                      }))
                    }
                  />
                  <Label htmlFor="numeric">Numerical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="special"
                    checked={randomOptions.special}
                    onCheckedChange={(checked) =>
                      setRandomOptions((prev) => ({
                        ...prev,
                        special: checked === true,
                      }))
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
                  onChange={(e) => setLength(parseInt(e.target.value) || 1)}
                  className="w-24"
                />
              </div>
            </div>
          )}

          {type === "skySerials" && (
            <div className="space-y-4">
              <Select
                value={skySerialType}
                onValueChange={(value) => setSkySerialType(value as SkySerialType)}
              >
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
              <div className="flex items-center space-x-2">
                <Label htmlFor="prefix">Prefix:</Label>
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="Optional prefix"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="quantity">Quantity:</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-24"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>

        {generatedValues.length > 0 && (
          <div className="space-y-2">
            {generatedValues.map((value, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-secondary rounded"
              >
                <code className="text-sm">{value}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(value)}
                >
                  Copy
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;