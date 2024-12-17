import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  GeneratorType,
  SkySerialType,
  generateRandom,
  generateUUID,
  generateSkySerial,
} from "@/utils/generators";
import RandomGenerator from "./generators/RandomGenerator";
import SkySerialGenerator from "./generators/SkySerialGenerator";

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
  const [deviceType, setDeviceType] = useState<"Glass" | "Puck">();
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
            value = generateSkySerial(skySerialType, prefix, deviceType);
            break;
        }
        values.push(value);
      }
      setGeneratedValues(values);
      toast.success("Values generated successfully!");
    } catch (error) {
      toast.error("Error generating values");
      console.error(error);
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
            <RandomGenerator
              options={randomOptions}
              length={length}
              onOptionsChange={setRandomOptions}
              onLengthChange={setLength}
            />
          )}

          {type === "skySerials" && (
            <SkySerialGenerator
              type={skySerialType}
              prefix={prefix}
              deviceType={deviceType}
              onTypeChange={setSkySerialType}
              onPrefixChange={setPrefix}
              onDeviceTypeChange={
                skySerialType === "SKY17" ? setDeviceType : undefined
              }
            />
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