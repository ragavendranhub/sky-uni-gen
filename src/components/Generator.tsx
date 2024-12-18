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
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <Tabs 
          value={type} 
          onValueChange={(value) => setType(value as GeneratorType)} 
          className="w-full"
        >
          <TabsList className="w-full h-14 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-lg">
            <TabsTrigger 
              value="random" 
              className="flex-1 text-lg font-semibold hover:bg-white/20 transition-all duration-200"
            >
              Random
            </TabsTrigger>
            <TabsTrigger 
              value="uuid" 
              className="flex-1 text-lg font-semibold hover:bg-white/20 transition-all duration-200"
            >
              UUID
            </TabsTrigger>
            <TabsTrigger 
              value="skySerials" 
              className="flex-1 text-lg font-semibold hover:bg-white/20 transition-all duration-200"
            >
              Sky Serials
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4 bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10 shadow-xl">
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
          className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>

        {generatedValues.length > 0 && (
          <div className="space-y-2">
            {generatedValues.map((item, index) => (
              item.visible && (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <code className="text-sm">{item.value}</code>
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
                    className="hover:bg-white/10"
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

export default Generator;