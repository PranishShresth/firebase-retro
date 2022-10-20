import { Avatar, Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { useAuthContext } from "context/Auth/AuthContext";
import { getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import Select, { components, OptionProps, StylesConfig } from "react-select";
import { usersCollection } from "utils/firebaseCollection";
import { Member } from "utils/interfaces";

const UserSelect = ({
  field,
  members,
}: {
  field: FieldValues;
  members: Member[];
}) => {
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
      };
    },
  };

  useEffect(() => {
    const getUsers = async () => {
      const userQuery = query(
        usersCollection,
        where("userId", "!=", member?.userId)
      );
      const userSnapshot = await getDocs(userQuery);

      const users = userSnapshot.docs
        .map((user) => {
          const member = user.data();
          const label = `${member.firstName} ${member.lastName}`;
          return {
            label,
            value: member,
            id: member.userId,
            subLabel: member.email,
          };
        })
        .filter((user) => !members.some((member) => member.userId === user.id));
      setOptions(users);
    };

    getUsers();
  }, [member?.userId, members]);

  return (
    <Select
      {...field}
      // ref={selectInputRef}
      isMulti
      options={options}
      styles={colourStyles}
      components={{ Option: CustomOption }}
    />
  );
};

const CustomOption = (props: any) => {
  const { label, subLabel } = props.data as { label: string; subLabel: string };
  return (
    <components.Option {...props}>
      <Flex alignItems="center">
        <Avatar name={label} size="sm" marginRight="12px" />
        <Box>
          <span>{label}</span>
          <div style={{ color: "darkgray" }}>{subLabel}</div>
        </Box>
      </Flex>
    </components.Option>
  );
};

export default UserSelect;
