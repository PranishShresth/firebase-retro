import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Cleave from "cleave.js/react";
import { UserDetails } from "utils/interfaces";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import styled from "styled-components";

interface FormValues {
  birthDate: string;
}

const FormErrorMessage = styled.span`
  color: #e8575b;
  font-weight: bold;
  position: relative;
  top: 4px;
`;

const BirthDate = ({ userDetails }: Record<string, UserDetails | null>) => {
  const bg = useColorModeValue("white", "gray.600");
  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      birthDate: userDetails?.birthDate ?? "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleUpdatingBirthDate = async (data: FormValues) => {
    try {
      if (userDetails) {
        setIsLoading(true);
        const ref = doc(firestore, "users", userDetails.userId);

        await setDoc(ref, {
          ...userDetails,
          birthDate: data.birthDate,
        });
        toast({
          title: "Birthday successfully updated",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleUpdatingBirthDate)}>
      <Box
        backgroundColor={bg}
        borderRadius={"lg"}
        boxShadow={"0 4px 12px 0 rgb(0 0 0 / 5%)"}
        marginTop={"2rem"}
        p="6"
      >
        <Text fontSize="xl" fontWeight={"bold"} marginBottom="1rem">
          When is your birthday?
        </Text>

        <Flex justifyContent={"space-between"}>
          <Flex width={"50%"}>
            <Box>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      as={Cleave}
                      options={{
                        date: true,
                        datePattern: ["d", "m", "Y"],
                        delimiter: "/",
                      }}
                      placeholder="DD/MM/YYYY"
                      value={field.value}
                    />
                  </>
                )}
                rules={{
                  required: "Birth Date is required",
                  pattern: {
                    value: /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    message: "Invalid date format",
                  },
                }}
              />
              {errors.birthDate?.message && (
                <FormErrorMessage>{errors.birthDate.message}</FormErrorMessage>
              )}
            </Box>
          </Flex>
          <Box>
            <Button
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Updating..."
              type="submit"
              variant="outline"
            >
              Update
            </Button>
          </Box>
        </Flex>
      </Box>
    </form>
  );
};

export default BirthDate;
