import { useColorModeValue } from "@chakra-ui/react";
import { useAuthContext } from "context/Auth/AuthContext";
import { getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import Select, { components, OptionProps, StylesConfig } from "react-select";
import { usersCollection } from "utils/firebaseCollection";
import { Member } from "utils/interfaces";

const UserSelect = ({ field }: FieldValues) => {
  const { member } = useAuthContext();
  const inputBg = useColorModeValue("#f7f7f7", "gray.700");
  const optionsBg = useColorModeValue("#ffffff", "#2d3748");
  const optionColourBg = useColorModeValue("#000000", "#ffffff");
  const optionHoverBg = useColorModeValue("#ffffff14", "#cbd5e0");
  const [options, setOptions] = useState<any>([]);

  const colourStyles: StylesConfig<any> = {
    control: (styles) => ({ ...styles, backgroundColor: inputBg }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? optionsBg
          : isSelected
          ? data.color
          : isFocused
          ? optionHoverBg
          : optionsBg,
        color: isDisabled ? "#ccc" : isSelected ? "white" : optionColourBg,
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

  useEffect(() => {
    const getUsers = async () => {
      const userQuery = query(
        usersCollection,
        where("userId", "!=", member?.userId)
      );
      const userSnapshot = await getDocs(userQuery);

      const users = userSnapshot.docs.map((user) => {
        const member = user.data();
        const label = `${member.firstName} ${member.lastName}`;
        return {
          label,
          value: member,
          subLabel: member.email,
        };
      });
      setOptions(users);
    };

    getUsers();
  }, [member?.userId]);

  return (
    <Select
      {...field}
      isMulti
      options={options}
      styles={colourStyles}
      components={{ Option: CustomOption }}
    />
  );
};

const CustomOption = (props: OptionProps) => {
  const { label, subLabel } = props.data as { label: string; subLabel: string };
  return (
    <components.Option {...props}>
      <span>{label}</span>
      <div style={{ color: "darkgray" }}>{subLabel}</div>
    </components.Option>
  );
};

export default UserSelect;
