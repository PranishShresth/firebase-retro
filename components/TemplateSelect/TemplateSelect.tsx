import { useColorModeValue } from "@chakra-ui/react";
import { FieldValues } from "react-hook-form";
import Select, { StylesConfig } from "react-select";

export const TEMPLATE_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Australia Dev Retro", value: "australiaDevRetro" },
  { label: "Australia Town Hall", value: "australiaTownHall" },
];

export const TemplateSelect = ({ field }: { field: FieldValues }) => {
  const inputBg = useColorModeValue("#f7f7f7", "gray.700");
  const optionsBg = useColorModeValue("#ffffff", "#2d3748");
  const optionColourBg = useColorModeValue("#000000", "#ffffff");
  const optionHoverBg = useColorModeValue("#ffffff14", "#ccc");

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

        color: isDisabled
          ? "#ccc"
          : isSelected || isFocused
          ? "black"
          : optionColourBg,
        cursor: isDisabled ? "not-allowed" : isFocused ? "pointer" : "default",

        ":first-child": {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        ":last-child": {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
      };
    },
    input: (styles) => ({ ...styles, color: optionColourBg }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 8,
    }),
    menuList: (provided, state) => ({
      paddingTop: 0,
      paddingBottom: 0,
    }),
    // placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
    singleValue: (styles, { data }) => ({ ...styles, color: optionColourBg }),
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
