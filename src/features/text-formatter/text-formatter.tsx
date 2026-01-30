import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { Eye, EyeClosed, Type } from "lucide-react";
import { use, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { TextInput } from "../../components/ui/text-input";
import { AlertContext } from "../../context/alert-context";
import { ConfigContext } from "../../context/config-context";
import { StyledTextRow } from "./components/styled-text-row";
import { TEXT_STYLES } from "./utils/unicode-mappings";

export const TextFormatter = () => {
  const { sendAlert } = use(AlertContext);
  const { fancyTextVisible, toggleFancyTextVisible } = use(ConfigContext);
  const [inputText, setInputText] = useState("");

  const handleCopy = (styleName: string, styledText: string) => {
    void writeText(styledText);
    sendAlert({
      type: "success",
      content: `Copied ${styleName} to clipboard!`,
    });
  };

  return (
    <Card
      header="Fancy Text"
      headerIcon={<Type size={16} />}
      headerRight={
        <Button small onClick={toggleFancyTextVisible}>
          {fancyTextVisible ? <Eye size={14} /> : <EyeClosed size={14} />}
        </Button>
      }
      hideContent={!fancyTextVisible}
      content={
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <TextInput
              placeholder="Type something..."
              valid
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              containerClassName="w-full"
            />
            <Button
              variant="red"
              onClick={() => setInputText("")}
              className="self-stretch"
            >
              Clear
            </Button>
          </div>

          <div className="grid select-none grid-flow-dense grid-cols-2 gap-px rounded-sm border border-zinc-900">
            {TEXT_STYLES.map((style) => (
              <StyledTextRow
                key={style.name}
                name={style.name}
                disabled={!inputText}
                preview={style.transform(inputText)}
                onCopy={() =>
                  handleCopy(
                    style.transform(inputText),
                    style.transform(inputText),
                  )
                }
                className={style.className}
              />
            ))}
          </div>
        </div>
      }
    />
  );
};
