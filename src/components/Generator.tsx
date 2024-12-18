import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

export const Generator = () => {
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
  const [customPrefix, setCustomPrefix] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [generatedValues, setGeneratedValues] = useState<Array<{value: string, visible: boolean}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    const values: Array<{value: string, visible: boolean}> = [];

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
        values.push({ value, visible: true });
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

  const copyToClipboard = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
    const newValues = [...generatedValues];
    newValues[index].visible = false;
    setGeneratedValues(newValues);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        <Tabs 
          value={type} 
          onValueChange={(value) => setType(value as GeneratorType)} 
          className="w-full"
        >
          <TabsList className="w-full h-14 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-lg">
            <TabsTrigger 
              value="random" 
              className="flex-1 text-lg font-semibold text-white hover:bg-white/20 transition-all duration-200"
            >
              Random
            </TabsTrigger>
            <TabsTrigger 
              value="uuid" 
              className="flex-1 text-lg font-semibold text-white hover:bg-white/20 transition-all duration-200"
            >
              UUID
            </TabsTrigger>
            <TabsTrigger 
              value="skySerials" 
              className="flex-1 text-lg font-semibold text-white hover:bg-white/20 transition-all duration-200"
            >
              Sky Serials
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4 bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-white/20 shadow-xl">
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
              customPrefix={customPrefix}
              onTypeChange={setSkySerialType}
              onPrefixChange={setPrefix}
              onDeviceTypeChange={setDeviceType}
              onCustomPrefixChange={setCustomPrefix}
            />
          )}
        </div>

        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl p-4 rounded-lg border border-white/20">
          <Label htmlFor="quantity" className="text-white">Quantity:</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-24 bg-white/20 border-white/20 text-white"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white border border-white/20 transition-all duration-200"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>

        {generatedValues.length > 0 && (
          <div className="space-y-2">
            {generatedValues.map((item, index) => (
              item.visible && (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <code className="text-sm text-white">{item.value}</code>
                      </TooltipTrigger>
                      <TooltipContent>
                        Length: {item.value.length}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.value, index)}
                    className="text-white hover:bg-white/20"
                  >
                    Copy
                  </Button>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
