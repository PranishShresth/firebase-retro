import { useColorModeValue } from "@chakra-ui/react";
import { FieldValues } from "react-hook-form";
import Select, { StylesConfig } from "react-select";

export const TEMPLATE_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Australia Retro", value: "australiaRetro" },
];

export const TemplateSelect = ({ field }: { field: FieldValues }) => {
  const inputBg = useColorModeValue("#f7f7f7", "gray.700");
  const optionsBg = useColorModeValue("#ffffff", "#2d3748");
  const optionColourBg = useColorModeValue("#000000", "#ffffff");
  const optionHoverBg = useColorModeValue("#ffffff14", "#cbd5e0");

  const colourStyles: StylesConfig<any> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: inputBg,
      marginTop: "4px",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? optionsBg
          : isSelected
          ? data.color
          : isFocused
          ? optionHoverBg
          : optionsBg,
        color: isDisabled ? "#ccc" : isSelected ? "black" : optionColourBg,
        cursor: isDisabled ? "not-allowed" : "default",

        // ":active": {
        //   ...styles[":active"],
        //   backgroundColor: !isDisabled
        //     ? isSelected
        //       ? data.color
        //       : color.alpha(0.3).css()
        //     : undefined,
        // },
      };
    },
    // input: (styles) => ({ ...styles, ...dot() }),
    // placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
    // singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };

  return (
    <Select
      {...field}
      defaultValue={TEMPLATE_OPTIONS[0]}
      options={TEMPLATE_OPTIONS}
      styles={colourStyles}
    />
  );
};
